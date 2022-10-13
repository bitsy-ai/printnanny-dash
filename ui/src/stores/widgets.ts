import { defineStore, acceptHMRUpdate } from "pinia";
import { WidgetCategory } from "@/types";
import type {
  WidgetItem
} from "@/types";
import { toRaw } from "vue";

import { connect, JSONCodec } from "nats.ws";

import ocotoprintLogo from "@/assets/logos/octoprint/octoprint_logo_rgb_250px.png";
import mainsailLogo from "@/assets/logos/mainsail/icon-192-maskable.png";
import printNannyLogo from "@/assets/logos/printnanny/logo.svg";
import syncThingLogo from "@/assets/logos/syncthing/logo-256.png";
import { useNatsStore } from "./nats";
import {
  NatsSubjectPattern,
  type NatsRequest,
  SystemctlCommand,
  type NatsResponse,
} from "@/types";
import { handleError } from "@/utils";


const DEFAULT_NATS_TIMEOUT = 6000;

export const useWidgetStore = defineStore({
  id: "widgets",
  state: () => ({
    enabledServices: {},
    items: {
      "octoprint": {
        name: "OctoPrint",
        href: "/octoprint/",
        service: "octoprint.service",
        logo: ocotoprintLogo,
        description: "The snappy web interface for your 3D Printer",
        category: WidgetCategory.PrinterManagement,
        menuItems: [
          { name: "Documentation", href: "https://docs.octoprint.org" },
          { name: "Plugin Repo", href: "https://plugins.octoprint.org" },
          { name: "/r/octoprint", href: "https://www.reddit.com/r/octoprint/" },
          { name: "Discord", href: "https://discord.octoprint.org/" },
        ],
      } as WidgetItem,
      "mainsail": {
        name: "Mainsail",
        href: "/mainsail/",
        service: "mainsail.service",
        logo: mainsailLogo,
        category: WidgetCategory.PrinterManagement,
        description:
          "Mainsail makes Klipper more accessible by adding a lightweight, responsive web user interface.",
        menuItems: [],
      } as WidgetItem,

      "printnannyVision": {
        name: "PrintNanny Vision",
        href: "/vision/",
        service: "printnanny-vision.service",
        logo: printNannyLogo,
        category: WidgetCategory.Apps,
        description:
          "The privacy-first defect and failure detection system. No internet connection required.",
        menuItems: [],
      } as WidgetItem,

      "syncthing": {
        name: "Syncthing",
        href: "/syncthing/",
        logo: syncThingLogo,
        category: WidgetCategory.Apps,
        description:
          "Sync files between two or more computers. Like having a private Dropbox.",
        service: "syncthing.service",
        menuItems: [],
      },
    }
  }),

  getters: {
    printerManagementItems(state): Array<WidgetItem> {
      return Object.values(state.items).filter(x => x.category === WidgetCategory.PrinterManagement)
    },
    appItems(state): Array<WidgetItem> {
      return Object.values(state.items).filter(x => x.category === WidgetCategory.Apps)
    }
  },

  actions: {
    async loadEnabledServices(): Promise<object> {
      const natsStore = useNatsStore();

      if (natsStore.natsConnection === undefined) {
        console.warn("loadEnabledServices called before NATS connection initialized")
        return []
      }
      const natsClient = toRaw(natsStore.natsConnection);

      const req = {
        service: "",
        command: SystemctlCommand.ListEnabled,
        subject: NatsSubjectPattern.SystemctlCommand
      } as NatsRequest;

      const requestCodec = JSONCodec<NatsRequest>();

      const resMsg = await natsClient?.request(req.subject, requestCodec.encode(req), { timeout: DEFAULT_NATS_TIMEOUT })
        .catch((e) => {
          handleError("Error loading enabled services", e);
          console.error(`Failed to publish subject=${req.subject} req:`, req)
        });

      if (resMsg) {
        const responseCodec = JSONCodec<NatsResponse>();
        const res = responseCodec.decode(resMsg.data);
        console.log("Enabled services:", res);
        this.$patch({ enabledServices: res.data });
        return res.data
      }

      return []
    },
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWidgetStore, import.meta.hot));
}
