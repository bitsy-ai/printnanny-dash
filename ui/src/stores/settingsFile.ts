import { JSONCodec, type NatsConnection } from "nats.ws";
import {
  NatsSubjectPattern,
  renderNatsSubjectPattern,
  type WidgetItem,
} from "@/types";
import { useNatsStore } from "./nats";
import { handleError } from "@/utils";

import type { SettingsFile, SettingsLoadReply } from "@bitsy-ai/printnanny-asyncapi-models";
import { defineStore, acceptHMRUpdate } from "pinia";


const DEFAULT_NATS_TIMEOUT = 12000;

export const useSettingsFileStore = defineStore(`settingsFiles`, {
  state: () => ({
    loading: true,
    settingsFiles: [] as Array<SettingsFile>,
    error: null as null | Error

  }),

  actions: {
    async load() {
      const natsStore = useNatsStore();
      const natsConnection: NatsConnection =
        await natsStore.getNatsConnection();
      const subject = renderNatsSubjectPattern(
        NatsSubjectPattern.SettingsLoad
      );

      const resMsg = await natsConnection
        ?.request(subject, undefined, {
          timeout: DEFAULT_NATS_TIMEOUT,
        })
        .catch((e) => {
          const msg = `Error loading device info`;
          this.$patch({ error: e })
          handleError(msg, e);
        });
      if (resMsg) {
        const resCodec = JSONCodec<SettingsLoadReply>();
        const res = resCodec.decode(resMsg?.data);
        console.log("Loaded settingsFiles:", res)

        this.$patch({ settingsFiles: res.files });
      }
      this.$patch({ loading: false });
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsFileStore, import.meta.hot));
}
