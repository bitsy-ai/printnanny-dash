import { toRaw } from "vue";
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
import { success } from "./alerts";

const DEFAULT_NATS_TIMEOUT = 12000;

export interface CameraSettingsForm {
  videoFramerate: number;
  hlsEnabled: boolean;
  recordVideo: boolean;
  backupCloud: boolean;
  selectedCaps: GstreamerCaps;
  selectedCamera: Camera;
  showDetectionOverlay: boolean;
  showDetectionGraphs: boolean;
}

const DEFAULT_CAPS = {
  media_type: "video/x-raw",
  format: "YUY2",
  width: 640,
  height: 480,
} as GstreamerCaps;

const DEFAULT_CAMERA = {
  index: 0,
  device_name: "/base/soc/i2c0mux/i2c@1/imx219@10",
  label: "imx219",
  src_type: CameraSourceType.CSI,
  selected_caps: DEFAULT_CAPS,
} as Camera;

<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> 66ffffe (remove intermediary form model)
=======
>>>>>>> 575cefe (fix ts build/lint)
export const useCameraSettingsStore = defineStore({
  id: "cameraSettings",
  state: () => ({
    loading: true,
    saving: false,
    cameras: [] as Array<Camera>,
    settings: undefined as undefined | PrintNannyCameraSettings,
  }),
  actions: {
    async loadCameras() {
      const natsStore = useNatsStore();
      const natsConnection: NatsConnection =
        await natsStore.getNatsConnection();

      const subject = renderNatsSubjectPattern(NatsSubjectPattern.CamerasLoad);

      const resCodec = JSONCodec<{ cameras: Array<Camera> }>();
      const resMsg = await natsConnection?.request(subject, undefined, {
        timeout: DEFAULT_NATS_TIMEOUT,
      });

      if (resMsg) {
        const data = resCodec.decode(resMsg?.data);
        console.log("Loaded available cameras", data);
        this.$patch({ cameras: data.cameras });
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
        const settings = resCodec.decode(resMsg?.data);
        console.log("Loaded camera settings:", settings);

        const camera = settings.camera as Camera;

        this.$patch({ settings });
      }
    },

    async save(form: CameraSettingsForm) {
      this.$patch({ saving: true });

      const natsStore = useNatsStore();
      const natsConnection: NatsConnection =
        await natsStore.getNatsConnection();

      const subject = renderNatsSubjectPattern(
        NatsSubjectPattern.CameraSettingsApply
      );

      const reqCodec = JSONCodec<PrintNannyCameraSettings>();

      const req = toRaw(this.settings) as PrintNannyCameraSettings;
      req.hls.hls_enabled = form.hlsEnabled;
      req.video_framerate = form.videoFramerate as number;
<<<<<<< HEAD
<<<<<<< HEAD
      req.camera = form.selectedCamera as Camera;
      req.camera.selected_caps = form.selectedCaps as GstreamerCaps;
=======
      req.video_src = form.selectedCamera as Camera;
      req.video_src.selected_caps = form.selectedCaps as GstreamerCaps;
>>>>>>> 66ffffe (remove intermediary form model)
=======
      req.camera = form.selectedCamera as Camera;
      req.camera.selected_caps = form.selectedCaps as GstreamerCaps;
>>>>>>> 575cefe (fix ts build/lint)
      req.detection.graphs = form.showDetectionGraphs as boolean;
      req.detection.overlay = form.showDetectionOverlay as boolean;

      console.log("Submitting camera settings request:", req);
      const resMsg = await natsConnection?.request(
        subject,
        reqCodec.encode(req),
        {
          timeout: DEFAULT_NATS_TIMEOUT,
        }
      );
      if (resMsg) {
        const resCodec = JSONCodec<PrintNannyCameraSettings>();
        const settings = resCodec.decode(resMsg?.data);
        console.log("Applied camera settings:", settings);
        const camera = settings.camera as Camera;
        this.$patch({ settings });
        success(
          `Updated Camera Settings`,
          `PrintNanny Cam was automatically restarted`
        );
      }
      this.$patch({ saving: false });
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
