import { toRaw } from "vue";
import { JSONCodec, type NatsConnection } from "nats.ws";
import { defineStore, acceptHMRUpdate } from "pinia";
import { useNatsStore } from "./nats";
import type {
  PrintNannyCameraSettings,
  GstreamerCaps,
  Camera,
} from "@bitsy-ai/printnanny-asyncapi-models";
import { NatsSubjectPattern, renderNatsSubjectPattern } from "@/types";
import { success } from "./alerts";
import { DEFAULT_NATS_TIMEOUT } from "@/types";

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
