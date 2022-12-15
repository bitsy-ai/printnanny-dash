import { defineStore, acceptHMRUpdate } from "pinia";
import { toRaw } from "vue";
import { JSONCodec, type Subscription, type NatsConnection } from "nats.ws";
import {
  type CamerasLoadReply,
  type Camera,
  type PlaybackVideo,
  type WebrtcSettingsApplyRequest,
  type WebrtcSettingsApplyReply,
  CameraSourceType,
  PlaybackSourceType,
} from "@bitsy-ai/printnanny-asyncapi-models";

import {
  ConnectionStatus,
  NatsSubjectPattern,
  renderNatsSubjectPattern,
  type QcDataframeRow,
} from "@/types";
import { handleError } from "@/utils";
import { useNatsStore } from "./nats";
import { useJanusStore } from "./janus";
import { error, useAlertStore, warning } from "./alerts";

const DEFAULT_NATS_TIMEOUT = 12000;

// returns true if num truthy elements / total elements >= threshold
function atLeast(arr: Array<boolean>, threshold: number): boolean {
  return arr.filter((el) => el === true).length / arr.length >= threshold;
}

export const DEMO_VIDEOS: Array<PlaybackVideo> = [
  {
    uri: "https://cdn.printnanny.ai/gst-demo-videos/demo_video_1.mp4",
    src_type: PlaybackSourceType.URI,
    cover: "https://cdn.printnanny.ai/gst-demo-videos/demo_video_cover_1.png",
    display_name: "Demo Video #1",
  },
  {
    uri: "https://cdn.printnanny.ai/gst-demo-videos/demo_video_2.mp4",
    src_type: PlaybackSourceType.URI,
    cover: "https://cdn.printnanny.ai/gst-demo-videos/demo_video_cover_2.png",
    display_name: "Demo Video #2",
  },
];

export const useVideoStore = defineStore({
  id: "videos",
  state: () => ({
    df: [] as Array<QcDataframeRow>,
    natsSubscription: undefined as undefined | Subscription,
    status: ConnectionStatus.ConnectionNotStarted as ConnectionStatus,
    sources: DEMO_VIDEOS as Array<Camera | PlaybackVideo>,
    selectedVideoSource: null as null | Camera | PlaybackVideo,
    playingStream: null as null | Camera | PlaybackVideo,
    error: null as null | Error,
    showOverlay: true,
  }),
  getters: {
    cameras(state): Array<Camera> {
      return state.sources.filter(
        (v) =>
          v.src_type === CameraSourceType.CSI ||
          v.src_type === CameraSourceType.USB
      ) as Array<Camera>;
    },
    videos(state): Array<PlaybackVideo> {
      return state.sources.filter(
        (v) =>
          v.src_type === PlaybackSourceType.FILE ||
          v.src_type === PlaybackSourceType.URI
      ) as Array<PlaybackVideo>;
    },
    meter_x(state): Array<number> {
      return state.df.map((el) => el.rt);
    },
    meter_y_nozzle_mean(state): Array<number> {
      return state.df.map((el) => el.nozzle__mean);
    },
    meter_y_nozzle_std: (state) => state.df.map((el) => el.nozzle__std),

    meter_y_print_mean: (state) => state.df.map((el) => el.print__mean),
    meter_y_print_std: (state) => state.df.map((el) => el.print__std),

    meter_y_raft_mean: (state) => state.df.map((el) => el.raft__mean),
    meter_y_raft_std: (state) => state.df.map((el) => el.raft__std),

    meter_y_adhesion_mean: (state) => state.df.map((el) => el.adhesion__mean),
    meter_y_adhesion_std: (state) => state.df.map((el) => el.adhesion__std),

    meter_y_spaghetti_mean: (state) => state.df.map((el) => el.spaghetti__mean),
    meter_y_spaghetti_std: (state) => state.df.map((el) => el.spaghetti__std),
  },
  actions: {
    async loadCameras(): Promise<Camera[]> {
      const natsStore = useNatsStore();
      const natsConnection: NatsConnection =
        await natsStore.getNatsConnection();

      const subject = renderNatsSubjectPattern(NatsSubjectPattern.CamerasLoad);

      const resMsg = await natsConnection
        ?.request(subject, undefined, { timeout: DEFAULT_NATS_TIMEOUT })
        .catch((e) => {
          const msg = `Error loading cameras`;
          this.$patch({ error: e });
          handleError(msg, e);
        });

      if (resMsg) {
        const resCodec = JSONCodec<CamerasLoadReply>();
        const res = resCodec.decode(resMsg?.data);
        this.sources.concat(res.cameras);
        return res.cameras;
      }
      return [];
    },
    getDetectionAlerts(df: Array<QcDataframeRow>): void {
      const alertStore = useAlertStore();

      if (df.length < 10) {
        console.warn(
          "Skipping getDetectionAlerts(), less than 10 datapoints available"
        );
        return;
      }
      const nozzleDetected = atLeast(
        df.map((el) => el.nozzle__count > 0),
        0.1
      );
      const printDetected = atLeast(
        df.map((el) => el.print__count > 0),
        0.1
      );
      const raftDetected = atLeast(
        df.map((el) => el.raft__count > 0),
        0.1
      );
      const adhesionFailureDetected = atLeast(
        df.map((el) => el.adhesion__count > 0),
        0.1
      );
      const spaghettiFailureDetected = atLeast(
        df.map((el) => el.spaghetti__count > 0),
        0.1
      );
      if (!nozzleDetected) {
        warning(
          "Calibration: Nozzle",
          "Calibration needed to improve nozzle monitoring."
        );
      }
      if (!printDetected) {
        warning(
          "Calibration: Printer",
          "Calibration needed to improve print object detection."
        );
      }

      if (!raftDetected) {
        warning(
          "Calibration: Raft",
          "Calibration needed to improve raft detection. Ignore this message if you are not printing with a raft."
        );
      }

      if (adhesionFailureDetected) {
        error(
          "Failure: Bed Adhesion",
          "Critical failures detected: print bed ahesion"
        );
      }
      if (spaghettiFailureDetected) {
        error(
          "Failure: Spaghetti",
          "Critical failures detected: filament spagehetti"
        );
      }
    },

    async subscribeQcDataframes() {
      const natsStore = useNatsStore();

      if (natsStore.natsConnection === undefined) {
        console.warn(
          "subscribeQcDataframes called before NATS connection initialized"
        );
        return;
      }
      const natsClient = toRaw(natsStore.natsConnection);

      // create a JSON codec/decoder
      const jsonCodec = JSONCodec<Array<QcDataframeRow>>();

      // this subscription listens for all Pi events (scoped to NATs account/org)
      const sub = natsClient.subscribe(NatsSubjectPattern.DataframeRow);
      this.$patch({ natsSubscription: sub });
      (async (sub: Subscription) => {
        console.log(`Subscribed to ${sub.getSubject()} events...`);
        for await (const msg of sub) {
          const df: Array<QcDataframeRow> = jsonCodec.decode(msg.data);
          this.getDetectionAlerts(df);
          this.$patch({ df });
          console.log("Deserialized dataframe", df);
        }
        console.log(`subscription ${sub.getSubject()} drained.`);
      })(sub);
    },

    async startStream() {
      this.$patch({
        status: ConnectionStatus.ConnectionLoading,
      });

      const janusStore = useJanusStore();

      await janusStore.connectJanus();
      janusStore.selectJanusStreamByPort();

      // get nats connection (awaits until NATS server is available)
      const natsStore = useNatsStore();
      const natsConnection: NatsConnection =
        await natsStore.getNatsConnection();

      const requestCodec = JSONCodec<WebrtcSettingsApplyRequest>();
      const req = {
        video_src: this.selectedVideoSource,
      } as WebrtcSettingsApplyRequest;
      const subject = renderNatsSubjectPattern(
        NatsSubjectPattern.WebrtcSettingsApply
      );
      console.log(`Sending request to ${subject}`, req);
      const resMsg = await natsConnection
        ?.request(subject, requestCodec.encode(req), {
          timeout: DEFAULT_NATS_TIMEOUT,
        })
        .catch((e) => {
          const msg = `Error appling webrtc settings ${req}`;
          handleError(msg, e);
        });
      if (resMsg) {
        const resCodec = JSONCodec<WebrtcSettingsApplyReply>();
        const res = resCodec.decode(resMsg?.data);
        console.log(`Received reply to ${subject}`, res);
      }
      janusStore.startJanusStream(toRaw(this.showOverlay));
    },
    async stopStream() {
      this.$patch({
        status: ConnectionStatus.ConnectionClosing,
        playingStream: null,
      });

      console.log("Attempting to stop all active streams");
      const janusStore = useJanusStore();
      await janusStore.stopAllStreams().catch((e: any) => {
        console.error("Error hanging up Janus connection:", e);
      });
      this.$patch({
        status: ConnectionStatus.ConnectionNotStarted,
        df: [],
      });
    },
    async toggleVideoPlayer() {
      // if selected stream is playing stream, stop video
      if (this.playingStream !== null) {
        return this.stopStream();
      } else {
        this.$patch({ playingStream: toRaw(this.selectedVideoSource) });
        await this.startStream();
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useVideoStore, import.meta.hot));
}
