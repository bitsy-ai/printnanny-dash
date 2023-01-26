import { defineStore, acceptHMRUpdate } from "pinia";
import { toRaw } from "vue";
import { JSONCodec, type Subscription, type NatsConnection } from "nats.ws";
import {
  type Camera,
  CameraSourceType,
  SystemdUnitActiveState,
  type VideoRecording,
  type CameraRecordingLoadReply,
} from "@bitsy-ai/printnanny-asyncapi-models";

import {
  ConnectionStatus,
  DEFAULT_NATS_TIMEOUT,
  NatsSubjectPattern,
  renderNatsSubjectPattern,
  WIDGETS,
  type QcDataframeRow,
} from "@/types";
import { handleError } from "@/utils";

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

// Un-comment to test Plotly graph with random data
// const TEST_DF = [...Array(10).keys()].map(i => {
//   const n = i + Math.random();
//   return {
//     adhesion__count: n * Math.random(),
//     adhesion__mean: n * Math.random(),
//     adhesion__std: n * Math.random(),
//     nozzle__count: n * Math.random(),
//     nozzle__mean: n * Math.random(),
//     nozzle__std: n * Math.random(),
//     print__count: n * Math.random(),
//     print__mean: n * Math.random(),
//     print__std: n * Math.random(),
//     raft__count: n * Math.random(),
//     raft__mean: n * Math.random(),
//     raft__std: n * Math.random(),
//     spaghetti__mean: n * Math.random(),
//     spaghetti__count: n * Math.random(),
//     spaghetti__std: n * Math.random(),
//     detection_scores: n * Math.random(),
//     rt: n * Math.random(),
//     rt___max: n * Math.random(),
//     rt__min: n * Math.random(),
//   } as QcDataframeRow
// });

export const useVideoStore = defineStore({
  id: "videos",
  state: () => ({
    loadingCameras: true,
    videoRecordings: [] as Array<VideoRecording>,
    currentVideoRecording: undefined as undefined | VideoRecording,
    df: [] as Array<QcDataframeRow>,
    natsSubscription: undefined as undefined | Subscription,
    status: ConnectionStatus.ConnectionLoading as ConnectionStatus,
    sources: [] as Array<Camera>,
    selectedVideoSource: null as null | Camera,
    playingStream: null as null | Camera,
    videoRecordingLoading: false,
    webrtcup: false,
    error: null as null | Error,
    showOverlay: true,
    showGraph: true,
  }),
  getters: {
    videoRecordingButtonEnabled(state): boolean {
      return state.webrtcup;
    },
    videoRecordingButtonShowStart(state): boolean {
      return state.currentVideoRecording === undefined;
    },
    videoRecordingButtonText(state): string {
      if (state.currentVideoRecording !== undefined) {
        return "Stop Recording";
      } else {
        return "Start Recording";
      }
    },
    cameraButtonDisabled(state): boolean {
      if (
        state.status === ConnectionStatus.ConnectionLoading ||
        state.status == ConnectionStatus.ConnectionClosing
      ) {
        return true;
      }
      return false;
    },
    cameraButtonText(state): string {
      if (state.status == ConnectionStatus.ServiceNotStarted) {
        return "Start Camera";
      } else if (state.status == ConnectionStatus.ConnectionReady) {
        return "Stop Camera";
      } else {
        return "";
      }
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

    async loadVideoRecordings() {
      const natsStore = useNatsStore();
      const natsConnection = await natsStore.getNatsConnection();
      const subject = renderNatsSubjectPattern(
        NatsSubjectPattern.CameraRecordingLoad
      );
      const resMsg = await natsConnection
        ?.request(subject, undefined, {
          timeout: DEFAULT_NATS_TIMEOUT,
        })
        .catch((e) => {
          const msg = "Error loading recording history";
          handleError(msg, e);
        });

      if (resMsg) {
        const resCodec = JSONCodec<CameraRecordingLoadReply>();
        const data = resCodec.decode(resMsg.data);
        console.log("Loaded edge VideoRecording catalog: ", data);
        this.$patch({
          videoRecordings: data.recordings,
          currentVideoRecording: data.current,
        });
      }
    },

    async startStream() {
      this.$patch({
        status: ConnectionStatus.ConnectionLoading,
      });

      const printNannyVisionWidget = WIDGETS["printnanny-vision"];
      const gstWidget = WIDGETS["gstd"];
      const printNannyVisionService = useSystemdServiceStore(
        printNannyVisionWidget
      );
      const gstService = useSystemdServiceStore(gstWidget);

      console.log(`Restarting ${gstService.unit}`);
      await gstService.restartService(false); // silence gst.service restarted notification, since this is an internal service

      console.log(`Restarting ${printNannyVisionService.unit}`);
      await printNannyVisionService.restartService(false); // show message indicating printnanny-vision.service was restarted

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

      const printNannyVisionWidget = WIDGETS["printnanny-vision"];
      const gstWidget = WIDGETS["gstd"];
      const printNannyVisionService = useSystemdServiceStore(
        printNannyVisionWidget
      );
      const gstService = useSystemdServiceStore(gstWidget);

      console.log(`Stopping ${gstService.unit}`);
      await gstService.stopService(false); // silence gst.service restarted notification, since this is an internal service

      console.log(`Stopping ${printNannyVisionService.unit}`);
      await printNannyVisionService.stopService(false); // show message indicating printnanny-vision.service was restarted

      console.log("Attempting to stop all active streams");
      const janusStore = useJanusStore();
      await janusStore.stopAllStreams().catch((e: any) => {
        console.error("Error hanging up Janus connection:", e);
      });
      this.$patch({
        status: ConnectionStatus.ConnectionNotStarted,
        df: [],
      });
      await this.stopRecording();
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
    async startRecording() {
      this.$patch({ videoRecordingLoading: true });
      const natsStore = useNatsStore();
      const natsConnection: NatsConnection =
        await natsStore.getNatsConnection();

      const subject = renderNatsSubjectPattern(
        NatsSubjectPattern.CameraRecordingStart
      );

      const resMsg = await natsConnection
        ?.request(subject, undefined, {
          timeout: DEFAULT_NATS_TIMEOUT,
        })
        .catch((e) => {
          const msg = "Error starting camera recording";
          handleError(msg, e);
        });

      if (resMsg) {
        const resCodec = JSONCodec<VideoRecording>();
        const videoRecording = resCodec.decode(resMsg.data);
        console.log("Started VideoRecording: ", videoRecording);
        this.$patch({ currentVideoRecording: videoRecording });
      }
      this.$patch({ videoRecordingLoading: false });
    },
    async stopRecording() {
      this.$patch({ videoRecordingLoading: true });
      const natsStore = useNatsStore();
      const natsConnection: NatsConnection =
        await natsStore.getNatsConnection();

      const subject = renderNatsSubjectPattern(
        NatsSubjectPattern.CameraRecordingStop
      );

      const resMsg = await natsConnection
        ?.request(subject, undefined, {
          timeout: DEFAULT_NATS_TIMEOUT,
        })
        .catch((e) => {
          const msg = "Error stopping camera recording";
          handleError(msg, e);
        });

      if (resMsg) {
        const resCodec = JSONCodec<VideoRecording>();
        const videoRecording = resCodec.decode(resMsg.data);
        console.log("Stopped VideoRecording: ", videoRecording);
        this.$patch({ currentVideoRecording: undefined });
      }
      this.$patch({ videoRecordingLoading: false });
    },
    async cameraButtonAction() {
      if (this.status === ConnectionStatus.ServiceNotStarted) {
        return await this.startStream();
      } else if (this.status === ConnectionStatus.ConnectionReady) {
        return await this.stopStream();
      } else {
        console.warn(
          `cameraButtonAction called with unhandled connection state: ${this.status}`
        );
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useVideoStore, import.meta.hot));
}
