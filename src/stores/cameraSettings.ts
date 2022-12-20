import { JSONCodec, type NatsConnection } from "nats.ws";
import { defineStore, acceptHMRUpdate } from "pinia";
import { useNatsStore } from "./nats";
import {
  type PrintNannyCameraSettings,
  type GstreamerCaps,
  type Camera,
  CameraSourceType,
} from "@bitsy-ai/printnanny-asyncapi-models";
import { NatsSubjectPattern, renderNatsSubjectPattern } from "@/types";

const DEFAULT_NATS_TIMEOUT = 12000;

export interface CameraSettingsForm {
  videoFramerate: number;
  hlsEnabled: boolean;
  selectedCaps: GstreamerCaps;
  selectedCamera: Camera;
}

export const useCameraSettingsStore = defineStore({
  id: "cameraSettings",
  state: () => ({
    loading: true,
    cameras: [
      {
        index: 0,
        device_name: "/base/soc/i2c0mux/i2c@1/imx219@10",
        label: "imx219",
        src_type: CameraSourceType.CSI,
        selectedCaps: {
          media_type: "video/x-raw",
          format: "YUY2",
          width: 640,
          height: 480,
        } as GstreamerCaps,
      },
    ] as Array<Camera>,
    form: undefined as undefined | CameraSettingsForm,
  }),
  actions: {
    async loadCameras() {
      const natsStore = useNatsStore();
      const natsConnection: NatsConnection =
        await natsStore.getNatsConnection();

      const subject = renderNatsSubjectPattern(NatsSubjectPattern.CamerasLoad);

      const resCodec = JSONCodec<Array<Camera>>();
      const resMsg = await natsConnection?.request(subject, undefined, {
        timeout: DEFAULT_NATS_TIMEOUT,
      });

      if (resMsg) {
        const data = resCodec.decode(resMsg?.data);
        console.log("Loaded available cameras", data);
      }
    },
    async loadSettings() {
      const natsStore = useNatsStore();
      const natsConnection: NatsConnection =
        await natsStore.getNatsConnection();

      const subject = renderNatsSubjectPattern(
        NatsSubjectPattern.CameraSettingsLoad
      );

      const resCodec = JSONCodec<PrintNannyCameraSettings>();
      const resMsg = await natsConnection?.request(subject, undefined, {
        timeout: DEFAULT_NATS_TIMEOUT,
      });

      if (resMsg) {
        const data = resCodec.decode(resMsg?.data);
        console.log("Loaded camera settings:", data);

        const camera = data.video_src as Camera;

        const form = {
          videoFramerate: data.video_framerate,
          hlsEnabled: data.hls.hls_enabled,
          selectedCamera: camera,
          selectedCaps: camera.selectedCaps,
        } as CameraSettingsForm;

        this.$patch({ form });
      }
    },

    async load() {
      await Promise.all([this.loadSettings(), this.loadCameras()]);
      this.$patch({ loading: false });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useCameraSettingsStore, import.meta.hot)
  );
}
