import { defineStore, acceptHMRUpdate } from "pinia";

import type { UiStickyAlert } from "@/types";

export const useAlertStore = defineStore({
  id: "alerts",
  state: () => ({
    alerts: [] as Array<UiStickyAlert>,
  }),

  actions: {
    pushAlert(alert: UiStickyAlert) {
      // show at most 1 alert message with the same header
      const alreadyShown = this.alerts.filter((a) => a.header == alert.header);
      if (alreadyShown.length === 0) {
        this.alerts.push(alert);
      }
    },
  }
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAlertStore, import.meta.hot));
}
