import { defineStore, acceptHMRUpdate } from "pinia";
import { toRaw } from "vue";
import {
  type JanusStream,
  ConnectionStatus,
  type VideoStream,
  type JanusMedia,
} from "@/types";
import Janode from "janode";
import StreamingPlugin from "janode/plugins/streaming";
import { handleError } from "@/utils";
import { useVideoStore } from "./video";

const RTCPeerConnection = window.RTCPeerConnection.bind(window);

function getJanusUri() {
  const hostname = window.location.hostname;
  const uri = `ws://${hostname}:${
    import.meta.env.VITE_PRINTNANNY_EDGE_JANUS_WS_PORT
  }`;
  console.log(`Connecting to Janus signaling websocket: ${uri}`);
  return uri;
}

export const useJanusStore = defineStore({
  id: "janus",
  state: () => ({
    janusWsConnection: undefined as undefined | any, // Janode.Connection, but Janode doe snot export types
    janusSession: undefined as undefined | any,
    janusPeerConnection: undefined as undefined | RTCPeerConnection,
    janusStreamingPluginHandle: undefined as undefined | any,
    selectedStream: undefined as undefined | JanusStream,
    streamList: [] as Array<JanusStream>,
    status: ConnectionStatus.ConnectionNotStarted as ConnectionStatus,
  }),

  actions: {
    selectJanusStreamByPort(stream: VideoStream) {
      const janusStream = this.streamList.find((el: JanusStream) => {
        const ports = el.media.map((m: JanusMedia) => m.port);
        return ports.includes(stream.udp_port);
      });
      if (janusStream === undefined) {
        throw Error("Stream not found in janus.plugin.streaming.jcfg");
      }
      this.$patch({ selectedStream: janusStream });
    },
    async stopAllStreams() {
      const videoEl = document.getElementById(
        "janus-video"
      ) as HTMLVideoElement;
      if (videoEl == null) {
        console.warn("Failed to get #janus-video element");
      }
      if (videoEl?.srcObject) {
        console.log("Stopping stream");
        (<MediaStream>videoEl.srcObject)
          .getTracks()
          .forEach((stream) => stream.stop());
        videoEl.srcObject = null;
      }
      this.$reset();
    },
    async connectJanus(): Promise<boolean> {
      const janusUri = getJanusUri();
      const connectOpts = {
        is_admin: false,
        address: {
          url: janusUri,
        },
      };
      const janusWsConnection = await Janode.connect(connectOpts).catch(
        (e: Error) => handleError("Janus websocket connection failed", e)
      );
      console.log("Got janusWsConnection", janusWsConnection);
      const janusSession = await janusWsConnection
        .create()
        .catch((e: Error) =>
          handleError("Failed to create Janus websocket session ", e)
        );
      const janusStreamingPluginHandle = await janusSession
        .attach(StreamingPlugin)
        .catch((e: Error) =>
          handleError("Failed to create Janus streaming handle", e)
        );
      const streamListRes = await janusStreamingPluginHandle.list();
      console.log("Found streamlist", streamListRes);
      // get detailed info from streamlist
      const streamList = await Promise.all(
        streamListRes.list.map(async (stream: any) => {
          const res = await janusStreamingPluginHandle.info({ id: stream.id });
          return {
            description: res.description,
            enabled: res.enabled,
            id: res.id,
            media: res.media,
            metadata: JSON.parse(res.metadata),
            name: res.name,
            type: res.type,
            viewers: res.viewers,
          } as JanusStream;
        })
      );

      console.log("Fetched detailed stream info", streamList);

      this.$patch({
        streamList,
      });

      janusStreamingPluginHandle.once(Janode.EVENT.HANDLE_DETACHED, () => {
        console.log(`${janusStreamingPluginHandle} manager handle detached`);
      });
      // Janode exports "EVENT" property with core events
      janusStreamingPluginHandle.on(
        Janode.EVENT.HANDLE_WEBRTCUP,
        (_data: any) => console.log("webrtcup event")
      );
      janusStreamingPluginHandle.on(
        Janode.EVENT.HANDLE_SLOWLINK,
        (evtdata: any) => {
          console.log("slowlink event", evtdata);
        }
      );
      janusStreamingPluginHandle.on(
        Janode.EVENT.HANDLE_HANGUP,
        (evtdata: any) => console.log("hangup event", evtdata)
      );
      janusStreamingPluginHandle.on(
        Janode.EVENT.HANDLE_DETACHED,
        (evtdata: any) => console.log("detached event", evtdata)
      );

      janusWsConnection.on(Janode.EVENT.CONNECTION_CLOSED, () => {
        console.log(`Connection with ${janusUri} closed`);
      });

      janusWsConnection.on(
        Janode.EVENT.CONNECTION_ERROR,
        ({ message }: { message: any }) => {
          console.log(`Connection with Janus error (${message})`);

          // TODO notify clients via alert

          // TODO reconnect
          // notify clients
        }
      );
      janusStreamingPluginHandle.on(
        StreamingPlugin.EVENT.STREAMING_STATUS,
        (evtdata: any) => {
          console.log(
            `${
              janusStreamingPluginHandle.name
            } streaming handle event status ${JSON.stringify(evtdata)}`
          );
        }
      );

      this.$patch({
        janusWsConnection,
        janusSession,
        janusStreamingPluginHandle,
      });
      if (streamList.length > 0 && this.selectedStream == undefined) {
        console.log("Setting selected stream to:", streamList[0]);
        this.$patch({ selectedStream: streamList[0] });
      }
      return true;
    },
    async closePC() {
      if (this.janusPeerConnection !== undefined) {
        const janusPeerConnection = toRaw(this.janusPeerConnection);

        console.log("stopping PeerConnection");
        janusPeerConnection.close();
        this.$patch({ janusPeerConnection: undefined });
      }
    },
    async trickle(event: any) {
      const { candidate } = event;
      if (this.janusStreamingPluginHandle === undefined) {
        console.warn(
          "trickle() called with undefined janusStreamingPluginHandle"
        );
        return;
      }
      const janusStreamingPluginHandle = toRaw(this.janusStreamingPluginHandle);

      if (candidate === undefined) {
        janusStreamingPluginHandle.trickleComplete().catch((e: any) => {
          console.error("trickleComplete error", e);
        });
      } else {
        janusStreamingPluginHandle.trickle(candidate).catch((e: any) => {
          console.error("trickle error", e);
        });
      }
    },
    async jsepAnswer(offer: any) {
      const pc = new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
        ],
      });
      pc.onnegotiationneeded = (event) =>
        console.log("pc.onnegotiationneeded", event);
      pc.onicecandidate = (event) =>
        this.trickle({ candidate: event.candidate });
      pc.oniceconnectionstatechange = () => {
        console.log(
          "pc.oniceconnectionstatechange => " + pc.iceConnectionState
        );
        if (
          pc.iceConnectionState === "failed" ||
          pc.iceConnectionState === "closed"
        ) {
          console.warn("Stopping all streams and closing peer connection");
          this.stopAllStreams();
          this.closePC();
        }
      };

      pc.ontrack = (event) => {
        console.log("pc.ontrack", event);

        event.track.onunmute = (evt) => {
          console.log("track.onunmute", evt);
        };
        event.track.onmute = (evt) => {
          console.log("track.onmute", evt);
        };
        event.track.onended = (evt) => {
          console.log("track.onended", evt);
        };

        const remoteStream = event.streams[0];
        this.setVideoElement(remoteStream);
      };

      this.$patch({ janusPeerConnection: pc });
      await pc.setRemoteDescription(offer);
      console.log("set remote sdp OK");
      const answer = await pc.createAnswer();
      console.log("create answer OK");
      pc.setLocalDescription(answer);
      console.log("set local sdp OK");
      return answer;
    },
    async setVideoElement(mediaStream: any) {
      if (!mediaStream) {
        return;
      }
      const videoEl = document.getElementById(
        "janus-video"
      ) as HTMLVideoElement;

      if (videoEl == null) {
        console.warn("Failed to get #janus-video element");
      }
      const videoStore = useVideoStore();

      videoEl.srcObject = mediaStream;
      console.log("Setting videoEl mediastream", videoEl, mediaStream);
      videoStore.$patch({ status: ConnectionStatus.ConnectionReady });
      videoEl.play().catch((e: any) => {
        console.error("Error setting video player.play()", e);
      });
    },
    async startJanusStream() {
      if (this.selectedStream == undefined) {
        console.warn(
          "startJanusStream() was called, but no stream is selected"
        );
        return;
      }

      this.$patch({ status: ConnectionStatus.ConnectionLoading });

      const janusStreamingPluginHandle = toRaw(this.janusStreamingPluginHandle);
      const media = toRaw(this.selectedStream.media);
      const watchdata = {
        id: this.selectedStream.id,
        media,
      };
      console.log("Sending watchdata", watchdata);
      const { jsep, _restart = false } = await janusStreamingPluginHandle.watch(
        watchdata
      );
      console.log(`Received offer`, jsep);

      const answer = await this.jsepAnswer(jsep);
      const { status, id } = await janusStreamingPluginHandle.start({
        jsep: answer,
      });
      console.log(`start ${id} response sent with status ${status}`);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useJanusStore, import.meta.hot));
}
