import { defineStore, acceptHMRUpdate } from "pinia";
import { toRaw } from "vue";
import {
  VideoStreamMerger,
  type DrawFunction,
  type AddStreamOptions,
  type ConstructorOptions,
} from "video-stream-merger";
import { type JanusStream, ConnectionStatus } from "@/types";
// import Janode from "janode";
// import StreamingPlugin from "janode/plugins/streaming";
import Janus from "@/vendor/janus";
import type { JanusJS } from "@/vendor/janus";
import { handleError } from "@/utils";
import { useVideoStore } from "./video";
import { useCameraSettingsStore } from "./cameraSettings";
import { success } from "./alerts";

export const IceServers = [{ urls: "stun:stun.l.google.com:19302" }];

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
    clientId: Janus.randomString(12),
    // janus: undefined as undefined | Janus,
    // janusWsConnection: undefined as undefined | any, // Janode.Connection, but Janode doe snot export types
    // janusSession: undefined as undefined | any,
    janusPeerConnection: undefined as undefined | RTCPeerConnection,
    janusStreamingPluginHandle: undefined as undefined | JanusJS.PluginHandle,
    selectedStream: undefined as undefined | JanusStream,
    streamList: [] as Array<JanusStream>,
    status: ConnectionStatus.ConnectionNotStarted as ConnectionStatus,
    videoRecordingFile: undefined as undefined | string,
    showOverlay: true as boolean,
    mountpoint: undefined,
  }),

  actions: {
    selectJanusStreamByPort() {
      // for now, only 1 stream is configured in janus.plugin.streaming.jcfg so we can select it
      // if we want to support multiple camera streams, we'd need to select the appropriate camera stream here
      const janusStream = this.streamList[0];
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

    async loadStreamsList(pluginHandle: JanusJS.PluginHandle) {
      const self = this;
      const listRequest = { request: "list" };
      console.log("Sending request to janus.plugin.streaming", listRequest);
      pluginHandle.send({
        message: listRequest,
        success: (result: any) => {
          if (!result) {
            console.warn("janus.plugin.streaming list returned no response");
            return;
          }
          if (result["list"]) {
            const streamListRes = result["list"];
            console.log(
              "Fetched list of available WebRTC streams:",
              streamListRes
            );
            // TODO do we need detailed stream info?
            // const streamList = await Promise.all(
            //   streamListRes.map(async (stream: any) => {
            //     const infoRequest = { request: "info", id: stream.id };

            //     const res = await janusStreamingPluginHandle.info({ id: stream.id });
            //     return {
            //       description: res.description,
            //       enabled: res.enabled,
            //       id: res.id,
            //       media: res.media,
            //       name: res.name,
            //       type: res.type,
            //       viewers: res.viewers,
            //     } as JanusStream;
            //   })
            // );
            // self.$patch({ streamList})
          }
        },
      });
    },
    startStream(pluginHandle: JanusJS.PluginHandle) {
      const message = { request: "watch", id: 1 };
      console.log("Requesting WebRTC stream start", message);
      pluginHandle.send({ message });
    },
    async onConnectSuccess(janus: JanusJS.Janus) {
      const self = this;
      let streaming = undefined as undefined | JanusJS.PluginHandle;

      // bounding box overlay is composited client-side using VideoStreamMerger element
      const cameraSettings = useCameraSettingsStore();
      if (cameraSettings.settings === undefined) {
        await cameraSettings.loadSettings();
      }
      const streamSettings = toRaw(cameraSettings.settings);
      const merger = new VideoStreamMerger({
        fps: streamSettings?.camera.framerate_n,
        height: streamSettings?.camera.height,
        width: streamSettings?.camera.width,
      } as ConstructorOptions);

      // create streaming plugin handle
      janus.attach({
        plugin: "janus.plugin.streaming",
        opaqueId: self.clientId,
        success: async (pluginHandle: JanusJS.PluginHandle) => {
          this.$patch({ janusStreamingPluginHandle: pluginHandle });
          streaming = pluginHandle;
          self.startStream(pluginHandle);
          await self.loadStreamsList(pluginHandle);
        },
        error: (error) => {
          handleError(
            "Error establishing janus.plugin.streaming handle",
            new Error(error)
          );
        },
        iceState: (
          state: "connected" | "failed" | "disconnected" | "closed"
        ) => {
          console.log(`WebRTC ice state is ${state}`);
        },
        webrtcState: (isConnected: boolean) => {
          console.log(`WebRTC is connected: ${isConnected}`);
        },
        slowLink: (uplink: boolean, lost: number, mid: string) => {
          console.warn(
            `WebRTC slow link detected. uplink=${uplink} lost=${lost} mid=${mid}`
          );
        },
        onmessage: (msg: JanusJS.Message, jsep?: JanusJS.JSEP) => {
          console.log("Received Janus message", msg, "JSEP: ", jsep);
          const result = msg["result"];

          // handle message contents
          if (result) {
            if (result["status"]) {
              const status = result["status"];
              console.log("WebRTC connection status: ", status);
            } else if (msg["streaming"] === "event") {
              const event = msg["streaming"];
              console.log("WebRTC event received: ", event);
            }
          } else if (msg["error"]) {
            handleError("Janus Gateway Error", new Error(msg["error"]));
          }

          // handle jsep contents
          if (jsep) {
            console.log("Handling SDP: ", jsep);
            streaming?.createAnswer({
              jsep,
              media: { audioSend: null, videoSend: null },
              success: (jsep) => {
                console.log("Received SDP: ", jsep);
                const startStreamRequest = { request: "start" };
                console.log("Sending start stream request", startStreamRequest);
                streaming?.send({ message: startStreamRequest, jsep: jsep });
              },
              error: (error) => {
                handleError("Janus Gateway SDP Error", new Error(error));
              },
            });
          }
        },
        onremotetrack: (track: MediaStreamTrack, mid: string, on: boolean) => {
          console.log(`Received remote track mid=${mid} on=${on}`, track);
          const videoStream = new MediaStream([track]);
          const showOverlay = self.showOverlay;

          // if showOverlay is true, render composite
          if (showOverlay) {
            const opts = {
              x: 0, // position of the topleft corner
              y: 0,
              width: merger.width,
              height: merger.height,
              mute: true,
              muted: true, // we don't want sound from the screen (if there is any)
              index: 0,
              draw: null as null | DrawFunction,
            } as AddStreamOptions;
            if (mid !== undefined) {
              opts.index = parseInt(mid.replace("v", "") as string);

              // remove black background from overlay video
              if (opts.index == 2) {
                opts.draw = (ctx, frame, done) => {
                  ctx.globalCompositeOperation = "screen";
                  ctx.drawImage(frame, 0, 0, merger.width, merger.height);
                  done();
                };
              }
              console.log("Merging stream with opts:", opts, event);
              merger.addStream(videoStream, opts);
            }
          } else if (mid === "v1") {
            console.log(
              `showOverlay=${showOverlay}, only adding stream with mid=${mid}`
            );
            merger.addStream(videoStream, undefined);
          }

          if (on) {
            merger.start();
            this.setVideoElement(merger.result);
          }
        },
      });
    },

    connectJanus() {
      // initialize janus library
      const self = this;
      this.$patch({ status: ConnectionStatus.ConnectionLoading });
      Janus.init({
        debug: "all",
        callback: () => {
          // is WebRTC supported for this browser?
          if (!Janus.isWebrtcSupported()) {
            const msg = `No WebRTC support for browser: ${Janus.webRTCAdapter.browserDetails.browser} - ${Janus.webRTCAdapter.browserDetails.version}`;
            console.error(msg);
            return handleError(msg, new Error(msg));
          }

          const server = getJanusUri();
          const janus = new Janus({
            server,
            iceServers: IceServers,
            success: () => self.onConnectSuccess(janus),
            error: (error) =>
              handleError(`Connection to ${server} failed`, error),
            destroyed: () => console.warn("WebRTC connection was destroyed"),
          });
        },
      });
    },
    // async closePC() {
    //   if (this.janusPeerConnection !== undefined) {
    //     const janusPeerConnection = toRaw(this.janusPeerConnection);

    //     console.log("stopping PeerConnection");
    //     janusPeerConnection.close();
    //     this.$patch({ janusPeerConnection: undefined });
    //   }
    // },
    // async trickle(event: any) {
    //   const { candidate } = event;
    //   if (this.janusStreamingPluginHandle === undefined) {
    //     console.warn(
    //       "trickle() called with undefined janusStreamingPluginHandle"
    //     );
    //     return;
    //   }
    //   const janusStreamingPluginHandle = toRaw(this.janusStreamingPluginHandle);

    //   if (candidate === undefined) {
    //     janusStreamingPluginHandle.trickleComplete().catch((e: any) => {
    //       console.error("trickleComplete error", e);
    //     });
    //   } else {
    //     janusStreamingPluginHandle.trickle(candidate).catch((e: any) => {
    //       console.error("trickle error", e);
    //     });
    //   }
    // },
    // async jsepAnswer(offer: any) {
    //   const cameraSettings = useCameraSettingsStore();
    //   if (cameraSettings.settings === undefined) {
    //     await cameraSettings.loadSettings();
    //   }
    //   const streamSettings = toRaw(cameraSettings.settings);
    //   const pc = new RTCPeerConnection({
    //     iceServers: [
    //       {
    //         urls: "stun:stun.l.google.com:19302",
    //       },
    //     ],
    //   });
    //   pc.onnegotiationneeded = (event) =>
    //     console.log("pc.onnegotiationneeded", event);
    //   pc.onicecandidate = (event) =>
    //     this.trickle({ candidate: event.candidate });
    //   pc.oniceconnectionstatechange = () => {
    //     console.log(
    //       "pc.oniceconnectionstatechange => " + pc.iceConnectionState
    //     );
    //     if (
    //       pc.iceConnectionState === "failed" ||
    //       pc.iceConnectionState === "closed"
    //     ) {
    //       console.warn("Stopping all streams and closing peer connection");
    //       this.stopAllStreams();
    //       this.closePC();
    //     }
    //   };

    //   const merger = new VideoStreamMerger({
    //     fps: streamSettings?.camera.framerate_n,
    //     height: streamSettings?.camera.height,
    //     width: streamSettings?.camera.width,
    //   } as ConstructorOptions);
    //   merger.start();
    //   this.setVideoElement(merger.result);

    //   pc.ontrack = (event) => {
    //     console.log("pc.ontrack", event);

    //     event.track.onunmute = (evt) => {
    //       console.log("track.onunmute", evt);
    //     };
    //     event.track.onmute = (evt) => {
    //       console.log("track.onmute", evt);
    //     };
    //     event.track.onended = (evt) => {
    //       console.log("track.onended", evt);
    //     };
    //     const videoStream = new MediaStream([event.track]);

    //     // if showOverlay is true
    //     if (this.showOverlay) {
    //       const opts = {
    //         x: 0, // position of the topleft corner
    //         y: 0,
    //         width: merger.width,
    //         height: merger.height,
    //         mute: true,
    //         muted: true, // we don't want sound from the screen (if there is any)
    //         index: 0,
    //         draw: null as null | DrawFunction,
    //       } as AddStreamOptions;
    //       if (event.transceiver.mid !== undefined) {
    //         opts.index = parseInt(
    //           event.transceiver.mid?.replace("v", "") as string
    //         );

    //         // remove black background from overlay video
    //         if (opts.index == 2) {
    //           opts.draw = (ctx, frame, done) => {
    //             ctx.globalCompositeOperation = "screen";
    //             ctx.drawImage(frame, 0, 0, merger.width, merger.height);
    //             done();
    //           };
    //         }
    //       }
    //       console.log("Merging stream with opts:", opts, event);
    //       merger.addStream(videoStream, opts);
    //     }
    //     // otherwise, just add main video stream and ignore bounding box track
    //     else if (event.transceiver.mid == "v1") {
    //       console.log("Adding stream with mid v1");
    //       merger.addStream(videoStream, undefined);
    //     }
    //   };

    //   this.$patch({ janusPeerConnection: pc });
    //   await pc.setRemoteDescription(offer);
    //   console.log("set remote sdp OK");
    //   const answer = await pc.createAnswer();
    //   console.log("create answer OK");
    //   pc.setLocalDescription(answer);
    //   console.log("set local sdp OK");
    //   return answer;
    // },
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
    // async startJanusStream(showOverlay: boolean) {
    //   console.log(
    //     "WebRTC adaptor detected browser: ",
    //     adapter.browserDetails.browser
    //   );
    //   console.log(
    //     "WebRTC adaptor detected version: ",
    //     adapter.browserDetails.version
    //   );

    //   this.$patch({ showOverlay });
    //   if (this.selectedStream == undefined) {
    //     console.warn(
    //       "startJanusStream() was called, but no stream is selected"
    //     );
    //     return;
    //   }

    //   this.$patch({ status: ConnectionStatus.ConnectionLoading });

    //   const janusStreamingPluginHandle = toRaw(this.janusStreamingPluginHandle);
    //   const media = toRaw(this.selectedStream.media);
    //   const watchdata = {
    //     id: toRaw(this.selectedStream.id),
    //     media,
    //   };
    //   console.log("Sending watchdata", watchdata);
    //   const { jsep, _restart = false } = await janusStreamingPluginHandle.watch(
    //     watchdata
    //   );
    //   console.log(`Received offer`, jsep);

    //   const answer = await this.jsepAnswer(jsep);
    //   const { status, id } = await janusStreamingPluginHandle.start({
    //     jsep: answer,
    //   });
    //   console.log(
    //     `Start mountpoint: ${id} response sent with status ${status}`
    //   );
    //   this.$patch({ mountpoint: id });
    // },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useJanusStore, import.meta.hot));
}
