import { toRaw } from "vue";
import { defineStore, acceptHMRUpdate } from "pinia";
import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/vue/20/solid";
import type { UiStickyAlert } from "@/types";
import * as api from "printnanny-api-client";
import { useCloudStore } from "./cloud";
import posthog from "posthog-js";

export const useAlertStore = defineStore({
  id: "alerts",
  state: () => ({
    alerts: [] as Array<UiStickyAlert>,
    reportedAlerts: [] as Array<UiStickyAlert>,
    showCrashReportForm: false,
    showCrashReportConfirm: false,
  }),

  actions: {
    pushAlert(alert: UiStickyAlert) {
      // show at most 1 alert message with the same header
      const alreadyShown = this.alerts.filter((a) => a.header == alert.header);
      if (alreadyShown.length === 0) {
        this.alerts.push(alert);
      }
    },
    clear() {
      this.$patch({ alerts: [] });
    },

    openCrashReport(header: string) {
      const crashReportAlert: undefined | UiStickyAlert = toRaw(this.alerts).find(
        (a) => a.header == header
      );
      this.clear();
      if (crashReportAlert) {
        this.reportedAlerts.push(crashReportAlert)
      }
      this.$patch({ showCrashReportForm: true })
    },

    async sendCrashReport(browserVersion: string, email: string, description: string) {
      const cloud = useCloudStore();
      const crashReportsApi = api.CrashReportsApiFactory(cloud.apiConfig);
      const osVersion = undefined; // enriched via NATS request
      const osLogs = undefined // enriched via NATS request
      const browserLogs = JSON.stringify(console.logs) // see logging.ts for console.logs implementation
      const serial = undefined; // enriched via NATS reuqest
      const posthogSession = JSON.stringify(posthog.sessionManager._getSessionId());
      const status = undefined; // for admin/support use
      const supportComment = undefined; // for admin/support use
      const user = undefined; // enriched via NATS reuqest
      const pi = undefined; // enriched via NATS reuqest
      await crashReportsApi.
        crashReportsCreate(
          description,
          email,
          osVersion,
          osLogs,
          browserVersion,
          browserLogs,
          serial,
          posthogSession,
          status,
          supportComment,
          user,
          pi)
    }
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
