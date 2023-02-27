import { toRaw } from "vue";
import { JSONCodec, type NatsConnection } from "nats.ws";
import { defineStore, acceptHMRUpdate } from "pinia";
import { useNatsStore } from "./nats";
import type {
  VideoStreamSettings,
  GstreamerCaps,
  Camera,
  CameraSettings,
} from "@bitsy-ai/printnanny-asyncapi-models";
import { NatsSubjectPattern, renderNatsSubjectPattern } from "@/types";
import { success } from "./alerts";
import { DEFAULT_NATS_TIMEOUT } from "@/types";
import { handleError } from "@/utils";

export interface CameraSettingsForm {
  videoFramerate: number;
  hlsEnabled: boolean;
  recordAutoStart: boolean;
  recordSyncCloud: boolean;
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
    selectedCaps: undefined as undefined | GstreamerCaps,
    selectedCamera: undefined as undefined | Camera,
    settings: undefined as undefined | VideoStreamSettings,
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

      const resCodec = JSONCodec<VideoStreamSettings>();
      const resMsg = await natsConnection
        ?.request(subject, undefined, {
          timeout: DEFAULT_NATS_TIMEOUT,
        })
        .catch((e) => {
          const msg = "Error loading camera settings";
          handleError(msg, e);
        });

      if (resMsg) {
        const settings = resCodec.decode(resMsg?.data);
        console.log("Loaded camera settings:", settings);
        const selectedCaps = {
          height: settings.camera.height,
          width: settings.camera.width,
          format: settings.camera.format,
          colorimetry: settings.camera.colorimetry,
          media_type: "",
        } as GstreamerCaps;
        const selectedCamera = this.cameras.find(
          (c) => c.device_name == settings.camera.device_name
        );
        this.$patch({ selectedCamera, selectedCaps });
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

      const reqCodec = JSONCodec<VideoStreamSettings>();
      const originalSettings = toRaw(this.settings) as VideoStreamSettings;
      const req = {
        hls: originalSettings.hls,
        camera: originalSettings.camera,
        detection: originalSettings.detection,
        recording: originalSettings.recording,
        rtp: originalSettings.rtp,
        snapshot: originalSettings.snapshot,
      };
      req.hls.enabled = form.hlsEnabled;
      req.camera = {
        height: this.selectedCaps?.height,
        width: this.selectedCaps?.width,
        format: this.selectedCaps?.format,
        colorimetry: this.selectedCaps?.colorimetry,
        device_name: this.selectedCamera?.device_name,
        label: this.selectedCamera?.label,
        framerate_d: form.videoFramerate,
        framerate_n: 1,
      } as CameraSettings;
      req.detection.graphs = form.showDetectionGraphs as boolean;
      req.detection.overlay = form.showDetectionOverlay as boolean;
      req.recording.cloud_sync = form.recordSyncCloud;

      console.log("Submitting camera settings request:", req);
      const resMsg = await natsConnection
        ?.request(subject, reqCodec.encode(req), {
          timeout: DEFAULT_NATS_TIMEOUT,
        })
        .catch((e) => {
          const msg = "Error saving camera settings";
          handleError(msg, e);
        });
      if (resMsg) {
        const resCodec = JSONCodec<VideoStreamSettings>();
        const settings = resCodec.decode(resMsg?.data);
        console.log("Applied camera settings:", settings);
        this.$patch({ settings });
        success(
          `Updated Camera Settings`,
          `PrintNanny Cam was automatically restarted`
        );
      }
      this.$patch({ saving: false });
    },

    async load() {
      await this.loadCameras();
      await this.loadSettings();
      this.$patch({ loading: false });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useCameraSettingsStore, import.meta.hot)
  );
}
