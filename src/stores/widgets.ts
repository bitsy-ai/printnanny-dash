import { defineStore, acceptHMRUpdate } from "pinia";
import type { ConfigFile, WidgetItem } from "@/types";
import { WidgetCategory, WIDGETS } from "@/types";
import { handleError } from "@/utils";

export const useWidgetStore = defineStore({
  id: "widgets",
  state: () => ({
    enabledServices: {},
    configs: undefined as undefined | Array<ConfigFile>,
    selectedConfig: undefined as undefined | string,
    items: WIDGETS
  }),

  getters: {
    printerManagementItems(state): Array<WidgetItem> {
      return Object.values(state.items).filter(
        (x) => x.category === WidgetCategory.PrinterManagement
      );
    },
    printNannyAppItems(state): Array<WidgetItem> {
      return Object.values(state.items).filter(
        (x) => x.category === WidgetCategory.PrintNannyApps
      );
    },
    otherAppItems(state): Array<WidgetItem> {
      return Object.values(state.items).filter(
        (x) => x.category === WidgetCategory.OtherApps
      );
    },
    cameraWidget(state): WidgetItem {
      return Object.values(state.items).filter(
        (x) => x.service === "printnanny-vision.service"
      )[0];
    },
  },

  actions: {
    async loadConfigs() {
      const basePath = import.meta.env.VITE_BASE_API_URL;
      const res = await window
        .fetch(`${basePath}pi/configs`)
        .catch((e) => handleError("Failed to load config data", e));

      const configs = await res?.json().catch((e) => {
        console.error("Failed to parse JSON from response: ", res);
        return handleError("Failed to parse json", e);
      });

      if (configs !== undefined) {
        this.$patch({ configs: configs as Array<ConfigFile> });
        if (this.selectedConfig === undefined) {
          this.$patch({ selectedConfig: configs[0].filename });
        }
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWidgetStore, import.meta.hot));
}
