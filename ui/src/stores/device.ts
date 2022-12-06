import { JSONCodec, type NatsConnection } from "nats.ws";
import { defineStore, acceptHMRUpdate } from "pinia";
import type { DeviceInfoLoadReply } from "@bitsy-ai/printnanny-asyncapi-models";
import { useNatsStore } from "./nats";
import { NatsSubjectPattern, renderNatsSubjectPattern } from "@/types";
import { handleError } from "@/utils";

const DEFAULT_NATS_TIMEOUT = 12000;

export const useDeviceStore = defineStore({
  id: "device",
  state: () => ({
    loading: true,
    deviceInfo: undefined as undefined | DeviceInfoLoadReply,
  }),
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
