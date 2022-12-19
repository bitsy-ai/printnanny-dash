import type { Camera } from "@bitsy-ai/printnanny-asyncapi-models";
import { JSONCodec, type NatsConnection } from "nats.ws";
import { defineStore, acceptHMRUpdate } from "pinia";
import { useNatsStore } from "./nats";
import type {
  PrintNannyCameraSettings,
  GstreamerCaps,
  Camera,
} from "@bitsy-ai/printnanny-asyncapi-models";
import { NatsSubjectPattern, renderNatsSubjectPattern } from "@/types";

const DEFAULT_NATS_TIMEOUT = 12000;

export interface CameraSettingsForm {
  framerate: number;
  hls_enabled: boolean;
  caps: GstreamerCaps;
  camera: Camera;
}

export const useCameraSettingsStore = defineStore({
  id: "cameraSettings",
  state: () => ({
    loading: true,
    cameras: [] as Array<Camera>,
    settings: null as null | PrintNannyCameraSettings,
  }),
  actions: {
    async load() {
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
        console.log("Loaded PrintNannyCameraSettings:", settings);
        this.$patch({ settings, loading: false });
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useCameraSettingsStore, import.meta.hot)
  );
}
