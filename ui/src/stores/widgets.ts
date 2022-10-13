import { defineStore, acceptHMRUpdate } from "pinia";
import { WidgetCategory } from "@/types";
import type {
  WidgetItem
} from "@/types";

import ocotoprintLogo from "@/assets/logos/octoprint/octoprint_logo_rgb_250px.png";
import mainsailLogo from "@/assets/logos/mainsail/icon-192-maskable.png";
import printNannyLogo from "@/assets/logos/printnanny/logo.svg";
import syncThingLogo from "@/assets/logos/syncthing/logo-256.png";


export const useWidgetStore = defineStore({
  id: "widgets",
  state: () => ({
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
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWidgetStore, import.meta.hot));
}
