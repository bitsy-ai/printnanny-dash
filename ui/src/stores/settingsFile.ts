import {
  NatsSubjectPattern,
  renderNatsSubjectPattern,
  type WidgetItem,
} from "@/types";
import type { SettingsFile } from "@bitsy-ai/printnanny-asyncapi-models";
import { defineStore, acceptHMRUpdate } from "pinia";

export const useSettingsFileStore = (widget: WidgetItem) => {
  const scopedStoreDefinition = defineStore(`settings/${widget.service}`, {
    state: () => ({
      widget: widget,
      loading: true,
      settingsFiles: [] as Array<SettingsFile>
    })
  })

  if (import.meta.hot) {
    import.meta.hot.accept(
      acceptHMRUpdate(scopedStoreDefinition, import.meta.hot)
    );
  }
  return scopedStoreDefinition();
}