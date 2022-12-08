import { JSONCodec, type NatsConnection } from "nats.ws";
import { NatsSubjectPattern, renderNatsSubjectPattern } from "@/types";
import { useNatsStore } from "./nats";
import { handleError } from "@/utils";
import type { UiStickyAlert } from "@/types";
import { CheckIcon } from "@heroicons/vue/20/solid";
import {
  SettingsApplyRequest,
  type SettingsFile,
  type SettingsLoadReply,
  type SettingsApplyReply,
} from "@bitsy-ai/printnanny-asyncapi-models";
import { defineStore, acceptHMRUpdate } from "pinia";
import { useAlertStore } from "./alerts";

const DEFAULT_NATS_TIMEOUT = 12000;

export const useSettingsFileStore = defineStore(`settingsFiles`, {
  state: () => ({
    loading: true,
    settingsFiles: [] as Array<SettingsFile>,
    loadReply: null as null | SettingsLoadReply,
    error: null as null | Error,
  }),

  actions: {
    async apply(file: SettingsFile, commitMsg: string) {
      this.$patch({ loading: true });
      const natsStore = useNatsStore();
      const natsConnection: NatsConnection =
        await natsStore.getNatsConnection();
      const subject = renderNatsSubjectPattern(
        NatsSubjectPattern.SettingsApply
      );
      const resCodec = JSONCodec<SettingsApplyRequest>();
      const res: SettingsApplyRequest = {
        file: file,
        git_head_commit: this.loadReply?.git_head_commit as string,
        git_commit_msg: commitMsg,
      };
      const resMsg = await natsConnection
        ?.request(subject, resCodec.encode(res), {
          timeout: DEFAULT_NATS_TIMEOUT,
        })
        .catch((e) => {
          const msg = `Error loading device info`;
          this.$patch({ error: e });
          handleError(msg, e);
        });
      if (resMsg) {
        const resCodec = JSONCodec<SettingsApplyReply>();
        const res = resCodec.decode(resMsg?.data);
        console.log("Sucessfully applied settings:", res);
        await this.load();
        const alertStore = useAlertStore();
        const alert: UiStickyAlert = {
          header: `Updated ${file.app} settings`,
          icon: CheckIcon,
          iconClass: "text-emerald-500",
          message: `${file.app} services were automatically restarted.`,
          actions: [],
        };
        alertStore.pushAlert(alert);
      }
    },
    async load() {
      this.$patch({ loading: true });

      const natsStore = useNatsStore();
      const natsConnection: NatsConnection =
        await natsStore.getNatsConnection();
      const subject = renderNatsSubjectPattern(NatsSubjectPattern.SettingsLoad);

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
        const resCodec = JSONCodec<SettingsLoadReply>();
        const res = resCodec.decode(resMsg?.data);
        console.log("Loaded settingsFiles:", res);

        this.$patch({ settingsFiles: res.files, loadReply: res });
      }
      this.$patch({ loading: false });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useSettingsFileStore, import.meta.hot)
  );
}
