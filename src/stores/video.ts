import { defineStore, acceptHMRUpdate } from "pinia";
import { toRaw } from "vue";
import { JSONCodec, type Subscription } from "nats.ws";
import {
  type Camera,
  CameraSourceType,
  SystemdUnitActiveState,
} from "@bitsy-ai/printnanny-asyncapi-models";

import {
  ConnectionStatus,
  NatsSubjectPattern,
  type QcDataframeRow,
} from "@/types";

import { useNatsStore } from "./nats";
import { useJanusStore } from "./janus";
import { error, warning } from "./alerts";
import { useSystemdServiceStore } from "./systemdService";
import { useWidgetStore } from "./widgets";

// returns true if num truthy elements / total elements >= threshold
function atLeast(arr: Array<boolean>, threshold: number): boolean {
  return arr.filter((el) => el === true).length / arr.length >= threshold;
}

// TODO move demo videos to marketing site
// export const DEMO_VIDEOS: Array<PlaybackVideo> = [
//   {
//     uri: "https://cdn.printnanny.ai/gst-demo-videos/demo_video_1.mp4",
//     src_type: PlaybackSourceType.URI,
//     cover: "https://cdn.printnanny.ai/gst-demo-videos/demo_video_cover_1.png",
//     display_name: "Demo Video #1",
//   },
//   {
//     uri: "https://cdn.printnanny.ai/gst-demo-videos/demo_video_2.mp4",
//     src_type: PlaybackSourceType.URI,
//     cover: "https://cdn.printnanny.ai/gst-demo-videos/demo_video_cover_2.png",
//     display_name: "Demo Video #2",
//   },
// ];

export const useVideoStore = defineStore({
  id: "videos",
  state: () => ({
    loadingCameras: true,
    df: [] as Array<QcDataframeRow>,
    natsSubscription: undefined as undefined | Subscription,
    status: ConnectionStatus.ConnectionLoading as ConnectionStatus,
    sources: [] as Array<Camera>,
    selectedVideoSource: null as null | Camera,
    playingStream: null as null | Camera,
    error: null as null | Error,
    showOverlay: true,
    showGraph: true,
  }),
  getters: {
    videoRecordingFile(_state): undefined | string {
      const janusStore = useJanusStore();
      return janusStore.videoRecordingFile;
    },
    cameras(state): Array<Camera> {
      return state.sources.filter(
        (v) =>
          v.src_type === CameraSourceType.CSI ||
          v.src_type === CameraSourceType.USB
      ) as Array<Camera>;
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
    getDetectionAlerts(df: Array<QcDataframeRow>): void {
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

    async load() {
      // is printnanny-vision service enabled?
      const widgetStore = useWidgetStore();
      const systemdServices = useSystemdServiceStore(widgetStore.cameraWidget);
      await systemdServices.load();
      if (
        systemdServices.unit?.active_state === SystemdUnitActiveState.ACTIVE
      ) {
        await this.startStream();
      } else {
        console.warn("printnanny-vision.service is not active");
        this.$patch({ status: ConnectionStatus.ServiceNotStarted });
      }
    },

    async startStream() {
      this.$patch({
        status: ConnectionStatus.ConnectionLoading,
      });

      const janusStore = useJanusStore();

      await janusStore.connectJanus();
      janusStore.selectJanusStreamByPort();
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
