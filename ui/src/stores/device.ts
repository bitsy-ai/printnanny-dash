import { handleError } from "@/utils";
import { defineStore, acceptHMRUpdate } from "pinia";
import { type DeviceInfo } from "@/types";

export const useDeviceStore = defineStore({
  id: "device",
  state: () => ({

  }),
  actions: {
    async loadDeviceInfo() {
      const basePath = import.meta.env.VITE_BASE_API_URL;
      const res = await window
        .fetch(`${basePath}pi/version`)
        .catch((e) => handleError("Failed to load device info", e));

      const deviceInfo = await res?.json().catch((e) => {
        console.error("Failed to parse JSON from response: ", res);
        return handleError("Failed to parse json", e);
      });

      if (deviceInfo !== undefined) {
        this.$patch({ deviceInfo: deviceInfo as DeviceInfo });
      }
    },
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDeviceStore, import.meta.hot));
}
