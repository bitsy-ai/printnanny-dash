import { toRaw } from "vue";
import { defineStore, acceptHMRUpdate } from "pinia";
import { JSONCodec, type NatsConnection } from "nats.ws";

import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/vue/20/solid";
import type { UiStickyAlert } from "@/types";
import * as api from "printnanny-api-client";
import { useCloudStore } from "./cloud";
import posthog from "posthog-js";
import { NatsSubjectPattern, renderNatsSubjectPattern, DEFAULT_NATS_TIMEOUT } from "@/types";
import { useNatsStore } from "./nats";
import type {
  CrashReportOsLogsReply,
  CrashReportOsLogsRequest,
} from "@bitsy-ai/printnanny-asyncapi-models";
import { browserLogFile } from "@/utils/logging";


export const useAlertStore = defineStore({
  id: "alerts",
  state: () => ({
    alerts: [] as Array<UiStickyAlert>,
    reportedAlerts: [] as Array<UiStickyAlert>,
    showCrashReportForm: false,
    showCrashReportConfirm: false,
    showCrashReportAdditionalCommand: false,
    crashReport: undefined as undefined | api.CrashReport,
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
      const crashReportAlert: undefined | UiStickyAlert = toRaw(
        this.alerts
      ).find((a) => a.header == header);
      this.clear();
      if (crashReportAlert) {
        this.reportedAlerts.push(crashReportAlert);
      }
      this.$patch({ showCrashReportForm: true });
    },

    async enrichCrashReport(report: api.CrashReport) {
      const natsStore = useNatsStore();
      const natsConnection: NatsConnection =
        await natsStore.getNatsConnection();

      const subject = renderNatsSubjectPattern(
        NatsSubjectPattern.CrashReportOsLogs
      );
      const req = { id: report.id } as CrashReportOsLogsRequest;
      const reqCodec = JSONCodec<CrashReportOsLogsRequest>();

      const resMsg = await natsConnection?.request(
        subject,
        reqCodec.encode(req),
        {
          timeout: DEFAULT_NATS_TIMEOUT,
        }
      );

      if (resMsg) {
        const resCodec = JSONCodec<CrashReportOsLogsReply>();
        const data = resCodec.decode(resMsg.data);
        console.log(
          `Updated CrashReport id=${data.id} updated_dt=${data.updated_dt}`
        );
      }
    },

    async sendCrashReport(
      browserVersion: string,
      email: string,
      description: string
    ) {
      const cloud = useCloudStore();
      const crashReportsApi = api.CrashReportsApiFactory(cloud.apiConfig);
      const osVersion = undefined; // enriched via NATS request
      const osLogs = undefined; // enriched via NATS request
      const browserLogs = browserLogFile(); // see logging.ts for console.logs implementation
      const serial = undefined; // enriched via NATS reuqest
      const posthogSession =
        posthog.sessionManager !== undefined
          ? JSON.stringify(posthog.sessionManager._getSessionId())
          : undefined;
      const status = undefined; // for admin/support use
      const supportComment = undefined; // for admin/support use
      const user = undefined; // enriched via NATS reuqest
      const pi = undefined; // enriched via NATS reuqest
      const res = await crashReportsApi.crashReportsCreate(
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
        pi
      );
      try {
        await this.enrichCrashReport(res.data);
        return true;
      } catch (error) {
        console.error(
          "Error enriching CrashReport with PrintNanny OS system logs",
          error
        );
        this.$patch({
          crashReport: res.data,
          showCrashReportAdditionalCommand: true,
        });
        return false;
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
