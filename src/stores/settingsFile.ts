import { JSONCodec, type NatsConnection } from "nats.ws";
import { NatsSubjectPattern, renderNatsSubjectPattern, DEFAULT_NATS_TIMEOUT } from "@/types";
import { useNatsStore } from "./nats";
import { handleError } from "@/utils";
import type {
  SettingsFileApplyRequest,
  SettingsFile,
  SettingsFileLoadReply,
  SettingsFileApplyReply,
} from "@bitsy-ai/printnanny-asyncapi-models";
import { defineStore, acceptHMRUpdate } from "pinia";
import { success } from "./alerts";

export const useSettingsFileStore = defineStore(`settingsFiles`, {
  state: () => ({
    loading: true,
    settingsFiles: [] as Array<SettingsFile>,
    loadReply: null as null | SettingsFileLoadReply,
    error: null as null | Error,
  }),

  actions: {
    async apply(file: SettingsFile, commitMsg: string) {
      this.$patch({ loading: true });
      const natsStore = useNatsStore();
      const natsConnection: NatsConnection =
        await natsStore.getNatsConnection();
      const subject = renderNatsSubjectPattern(
        NatsSubjectPattern.SettingsFileApply
      );
      const resCodec = JSONCodec<SettingsFileApplyRequest>();
      const res: SettingsFileApplyRequest = {
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
        const resCodec = JSONCodec<SettingsFileApplyReply>();
        const res = resCodec.decode(resMsg?.data);
        console.log("Sucessfully applied settings:", res);
        await this.load();
        success(
          `Updated ${file.app} settings`,
          `${file.app} services were automatically restarted.`
        );
      }
    },
    async load() {
      this.$patch({ loading: true });

      const natsStore = useNatsStore();
      const natsConnection: NatsConnection =
        await natsStore.getNatsConnection();
      const subject = renderNatsSubjectPattern(
        NatsSubjectPattern.SettingsFileLoad
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
        const resCodec = JSONCodec<SettingsFileLoadReply>();
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
