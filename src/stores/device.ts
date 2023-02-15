import { JSONCodec, type NatsConnection } from "nats.ws";
import { defineStore, acceptHMRUpdate } from "pinia";
import type { DeviceInfoLoadReply } from "@bitsy-ai/printnanny-asyncapi-models";
import { useNatsStore } from "./nats";
import {
  NatsSubjectPattern,
  renderNatsSubjectPattern,
  DEFAULT_NATS_TIMEOUT,
} from "@/types";
import { handleError } from "@/utils";

export const useDeviceStore = defineStore({
  id: "device",
  state: () => ({
    loading: true,
    deviceInfo: undefined as undefined | DeviceInfoLoadReply,
    error: null as null | Error,
  }),
  getters: {
    imageName: (state) => {
      if (state.deviceInfo !== undefined) {
        const lines = state.deviceInfo.issue.split("\n");
        return lines[0].replace("IMAGE_NAME = ", "");
      }
    }
  },
  actions: {
    async load() {
      const natsStore = useNatsStore();
      const natsConnection: NatsConnection =
        await natsStore.getNatsConnection();

      const subject = renderNatsSubjectPattern(
        NatsSubjectPattern.DeviceInfoLoad
      );

      const resMsg = await natsConnection
        ?.request(subject, undefined, {
          timeout: DEFAULT_NATS_TIMEOUT,
        })
        .catch((e) => {
          const msg = `Error loading device info`;
          this.$patch({ error: e });
          handleError(msg, e);
        });

      if (resMsg) {
        const resCodec = JSONCodec<DeviceInfoLoadReply>();
        const res = resCodec.decode(resMsg?.data);

        this.$patch({ deviceInfo: res });
      }
      this.$patch({ loading: false });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDeviceStore, import.meta.hot));
}
