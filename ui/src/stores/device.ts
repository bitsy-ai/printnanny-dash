import { handleError } from "@/utils";
import { defineStore, acceptHMRUpdate } from "pinia";
import type { DeviceInfoLoadReply } from "@bitsy-ai/printnanny-asyncapi-models";

export const useDeviceStore = defineStore({
  id: "device",
  state: () => ({
    loading: true,
    deviceInfo: undefined as undefined | DeviceInfoLoadReply,
  }),
  actions: {
    async loadDeviceInfo() {},
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDeviceStore, import.meta.hot));
}
