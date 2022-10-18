import { defineStore, acceptHMRUpdate } from "pinia";
import { toRaw } from "vue";
import { JSONCodec, type Subscription } from "nats.ws";
import { ExclamationTriangleIcon } from "@heroicons/vue/20/solid";
import {
  ConnectionStatus,
  NatsSubjectPattern,
  SystemctlCommand,
  VideoSrcType,
  type QcDataframeRow,
  type UiStickyAlert,
  type SystemctlCommandRequest,
  type PiConfigRequest,
  type VideoStream,
} from "@/types";
import { handleError } from "@/utils";
import { useNatsStore } from "./nats";
import { useJanusStore } from "./janus";
import { useAlertStore } from "./alerts";
import VideoPaused from "@/assets/video-paused.svg";

// returns true if num truthy elements / total elements >= threshold
function atLeast(arr: Array<boolean>, threshold: number): boolean {
  return arr.filter((el) => el === true).length / arr.length >= threshold;
}

export const VIDEO_STREAMS: Array<VideoStream> = [
  {
    src: "/dev/video0",
    src_type: VideoSrcType.Device,
    cover: VideoPaused,
    name: "Camera: /dev/video0",
    description: "",
    udp_port: 20002,
  },
  {
    src: "https://cdn.printnanny.ai/gst-demo-videos/demo_video_1.mp4",
    src_type: VideoSrcType.Uri,
    cover: "https://cdn.printnanny.ai/gst-demo-videos/demo_video_cover_1.png",
    name: "Demo Video #1",
    description: "",
    udp_port: 20001,
  },
  {
    src: "https://cdn.printnanny.ai/gst-demo-videos/demo_video_2.mp4",
    src_type: VideoSrcType.Uri,
    cover: "https://cdn.printnanny.ai/gst-demo-videos/demo_video_cover_2.png",
    name: "Demo Video #2",
    description: "",
    udp_port: 20001,
  },
];

export const useVideoStore = defineStore({
  id: "videos",
  state: () => ({
    df: [] as Array<QcDataframeRow>,
    status: ConnectionStatus.ConnectionNotStarted as ConnectionStatus,
    videoStreams: VIDEO_STREAMS,
    selectedVideoStream: 0,
    playingVideoStream: undefined as undefined | number,
  }),
  getters: {
    meter_x(state): Array<number> {
      return state.df.map((el) => el.ts);
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
    // async connect(): Promise<void> {
    //   const natsStore = useNatsStore();
    //   const janusStore = useJanusStore();

    //   this.$patch({ status: ConnectionStatus.ConnectionLoading });
    //   const natsOk = await natsStore.connect();
    //   const janusOk = await janusStore.connectJanus();
    //   if (natsOk && janusOk) {
    //     this.$patch({ status: ConnectionStatus.ConnectionReady });
    //   } else {
    //     this.$patch({ status: ConnectionStatus.ConnectionError });
    //   }
    // },

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
        0.3
      );
      const printDetected = atLeast(
        df.map((el) => el.print__count > 0),
        0.4
      );
      const raftDetected = atLeast(
        df.map((el) => el.raft__count > 0),
        0.3
      );
      const adhesionFailureDetected = atLeast(
        df.map((el) => el.adhesion__count > 0),
        0.15
      );
      const spaghettiFailureDetected = atLeast(
        df.map((el) => el.spaghetti__count > 0),
        0.15
      );
      if (!nozzleDetected) {
        const alert: UiStickyAlert = {
          header: "Calibration: Nozzle",
          icon: ExclamationTriangleIcon,
          color: "indigo",
          message: "Calibration needed to improve nozzle monitoring.",
          actions: [],
        };
        // alert store will filter duplicate alerts
        alertStore.pushAlert(alert);
      }
      if (!printDetected) {
        const alert: UiStickyAlert = {
          header: "Calibration: Printer",
          icon: ExclamationTriangleIcon,
          color: "indigo",
          message: "Calibration needed to improve print object detection.",
          actions: [],
        };
        alertStore.pushAlert(alert);
      }

      if (!raftDetected) {
        const alert: UiStickyAlert = {
          header: "Calibration: Raft",
          icon: ExclamationTriangleIcon,
          color: "indigo",
          message: "Calibration needed to improve raft detection.",
          actions: [],
        };
        alertStore.pushAlert(alert);
      }

      if (adhesionFailureDetected) {
        const alert: UiStickyAlert = {
          header: "Failure: Bed Adhesion",
          icon: ExclamationTriangleIcon,
          color: "red",
          message: "Critical failures detected. Pausing 3D print job.",
          actions: [],
        };
        alertStore.pushAlert(alert);
      }
      if (spaghettiFailureDetected) {
        const alert: UiStickyAlert = {
          header: "Failure: Spaghetti",
          icon: ExclamationTriangleIcon,
          color: "red",
          message: "Critical failures detected. Pausing 3D print job.",
          actions: [],
        };
        alertStore.pushAlert(alert);
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

      const natsStore = useNatsStore();
      const janusStore = useJanusStore();

      const selectedStream = this.videoStreams[this.selectedVideoStream];
      await janusStore.connectJanus();
      janusStore.selectJanusStreamByPort(selectedStream);

      const natsClient = toRaw(natsStore.natsConnection);
      const jsonCodec = JSONCodec<PiConfigRequest>();

      // apply any video stream configuration changes
      const cmdRequest: SystemctlCommandRequest = {
        subject: NatsSubjectPattern.SystemctlCommand,
        service: "printnanny-vision.servie",
        command: SystemctlCommand.Restart,
      };
      const natsRequest: PiConfigRequest = {
        subject: NatsSubjectPattern.Config,
        json: JSON.stringify({
          vision: {
            video_src: selectedStream.src,
            video_src_type: selectedStream.src_type,
            udp_port: selectedStream.udp_port,
          },
        }),
        post_save: [cmdRequest],
        pre_save: [],
      };
      console.debug("Publishing NATS request:", natsRequest);
      const res = await natsClient
        ?.request(natsRequest.subject, jsonCodec.encode(natsRequest), {
          timeout: 8000,
        })
        .catch((e) => handleError("Command Failed", e));
      console.debug(`NATS response:`, res);
      janusStore.startJanusStream();
    },

    async reset() {
      const janusStore = useJanusStore();
      this.$patch({ playingVideoStream: undefined });
      janusStore.stopAllStreams();
      this.$reset();
    },

    async toggleVideoPlayer() {
      // if selected stream is playing stream, stop video
      if (this.selectedVideoStream == this.playingVideoStream) {
        return this.$reset();
      }
      this.$patch({ playingVideoStream: this.selectedVideoStream });
      await this.startStream();
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useVideoStore, import.meta.hot));
}