import { defineStore, acceptHMRUpdate } from "pinia";
import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/vue/20/solid";
import type { UiStickyAlert } from "@/types";

window.onerror = function (msg, url, lineNo, columnNo, error) {
  console.log(msg, url, lineNo, columnNo, error)
}

export const useAlertStore = defineStore({
  id: "alerts",
  state: () => ({
    alerts: [] as Array<UiStickyAlert>,
    showCrashReportForm: false
  }),

  actions: {
    pushAlert(alert: UiStickyAlert) {
      // show at most 1 alert message with the same header
      const alreadyShown = this.alerts.filter((a) => a.header == alert.header);
      if (alreadyShown.length === 0) {
        this.alerts.push(alert);
      }
    },
  },
});

export function success(header: string, message: string) {
  const store = useAlertStore();
  const alert = {
    header,
    message,
    icon: CheckIcon,
    iconClass: "text-emerald-500",
    actions: [],
  };
  store.pushAlert(alert);
}

export function warning(header: string, message: string) {
  const store = useAlertStore();
  const alert = {
    header,
    message,
    icon: ExclamationTriangleIcon,
    iconClass: "text-amber-500",
    actions: [],
  };
  store.pushAlert(alert);
}

export function error(header: string, message: string) {
  const store = useAlertStore();
  const alert = {
    header,
    message,
    icon: ExclamationTriangleIcon,
    iconClass: "text-red-500",
    actions: [],
  };
  store.pushAlert(alert);
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAlertStore, import.meta.hot));
}
