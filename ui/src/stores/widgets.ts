import { defineStore, acceptHMRUpdate } from "pinia";
import { SystemdUnitStatus, WidgetCategory, type UiStickyAlert } from "@/types";
import type { WidgetItem } from "@/types";
import { toRaw } from "vue";

import { JSONCodec } from "nats.ws";

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
import { useEventStore } from "./events";

const DEFAULT_NATS_TIMEOUT = 6000;

export const useWidgetStore = defineStore({
  id: "widgets",
  state: () => ({
    enabledServices: {},
    serviceStatus: {},
    items: [
      {
        name: "OctoPrint",
        href: "/octoprint/",
        service: "octoprint.service",
        logo: ocotoprintLogo,
        description: "The snappy web interface for your 3D Printer",
        category: WidgetCategory.PrinterManagement,
        status: SystemdUnitStatus.Unknown,
        enabled: false,
        menuItems: [
          { name: "Documentation", href: "https://docs.octoprint.org" },
          { name: "Plugin Repo", href: "https://plugins.octoprint.org" },
          { name: "/r/octoprint", href: "https://www.reddit.com/r/octoprint/" },
          { name: "Discord", href: "https://discord.octoprint.org/" },
        ],
      } as WidgetItem,
      {
        name: "Mainsail",
        href: "/mainsail/",
        service: "mainsail.service",
        logo: mainsailLogo,
        category: WidgetCategory.PrinterManagement,
        enabled: false,
        status: SystemdUnitStatus.Unknown,
        description:
          "Mainsail makes Klipper more accessible by adding a lightweight, responsive web user interface.",
        menuItems: [],
      } as WidgetItem,

      {
        name: "PrintNanny Vision",
        href: "/vision/",
        service: "printnanny-vision.service",
        logo: printNannyLogo,
        category: WidgetCategory.PrintNannyApps,
        enabled: false,
        status: SystemdUnitStatus.Unknown,
        description:
          "The privacy-first defect and failure detection system. No internet connection required.",
        menuItems: [],
      } as WidgetItem,
      {
        name: "PrintNanny Cloud",
        href: "https://printnanny.ai/devices",
        service: "printnanny-cloud.service",
        logo: printNannyLogo,
        category: WidgetCategory.PrintNannyApps,
        enabled: false,
        status: SystemdUnitStatus.Unknown,
        description:
          "Get email notifications, view camera feed from anywhere, and sync settings with PrintNanny Cloud.",
        menuItems: [],
      } as WidgetItem,
      {
        name: "OS Updates",
        href: "/update/",
        service: "swupdate.service",
        logo: printNannyLogo,
        category: WidgetCategory.PrintNannyApps,
        enabled: false,
        status: SystemdUnitStatus.Unknown,
        description: "Update PrintNanny OS to the latest build.",
        menuItems: [],
      } as WidgetItem,
      {
        name: "Syncthing",
        href: "/syncthing/",
        logo: syncThingLogo,
        category: WidgetCategory.OtherApps,
        status: SystemdUnitStatus.Unknown,
        enabled: false,
        description:
          "Sync files between two or more computers. Like having a private Dropbox.",
        service: "syncthing.service",
        menuItems: [],
      } as WidgetItem,
    ],
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
  },

  actions: {
    async loadEnabledServices(): Promise<NatsResponse | undefined> {
      const natsStore = useNatsStore();

      if (natsStore.natsConnection === undefined) {
        console.warn(
          "loadEnabledServices called before NATS connection initialized"
        );
        return;
      }
      const natsClient = toRaw(natsStore.natsConnection);

      const req = {
        service: "",
        command: SystemctlCommand.ListEnabled,
        subject: NatsSubjectPattern.SystemctlCommand,
      } as NatsRequest;

      const requestCodec = JSONCodec<NatsRequest>();

      const resMsg = await natsClient
        ?.request(req.subject, requestCodec.encode(req), {
          timeout: DEFAULT_NATS_TIMEOUT,
        })
        .catch((e) => {
          handleError("Error loading enabled services", e);
          console.error(`Failed to publish subject=${req.subject} req:`, req);
        });

      if (resMsg) {
        const responseCodec = JSONCodec<NatsResponse>();
        const res = responseCodec.decode(resMsg.data);
        console.log("Enabled services:", res);
        this.$patch({ serviceStatus: res.data });
        // update item.enabled values
        this.items.map((el) => {
          if (el.service in res.data) {
            el.enabled = true;
          }
        });
        return res;
      }
    },

    async loadStatus(
      item: WidgetItem,
      idx: number
    ): Promise<NatsResponse | undefined> {
      const natsStore = useNatsStore();
      if (natsStore.natsConnection === undefined) {
        console.warn("showStatus called before NATS connection initialized");
        return;
      }
      const natsClient = toRaw(natsStore.natsConnection);
      const requestCodec = JSONCodec<NatsRequest>();

      const req = {
        service: item.service,
        command: SystemctlCommand.Status,
        subject: NatsSubjectPattern.SystemctlCommand,
      } as NatsRequest;

      const resMsg = await natsClient
        ?.request(req.subject, requestCodec.encode(req), {
          timeout: DEFAULT_NATS_TIMEOUT,
        })
        .catch((e) => {
          handleError("Error loading enabled services", e);
          console.error(`Failed to publish subject=${req.subject} req:`, req);
        });

      if (resMsg) {
        const responseCodec = JSONCodec<NatsResponse>();
        const res = responseCodec.decode(resMsg.data);
        console.debug(`${item.name} status:`, res);
        const activeState = res.data["ActiveState"];
        switch (activeState) {
          case "active":
            item.status = SystemdUnitStatus.Active;
            break;
          case "inactive":
            item.status = SystemdUnitStatus.Inactive;
            break;
          default:
            item.status = SystemdUnitStatus.Unknown;
        }
        this.items[idx] = item;
      }
    },

    async startService(item: WidgetItem) {
      const natsStore = useNatsStore();
      if (natsStore.natsConnection === undefined) {
        console.warn("startService called before NATS connection initialized");
        return;
      }
      const natsClient = toRaw(natsStore.natsConnection);
      const req = {
        service: item.service,
        command: SystemctlCommand.Start,
        subject: NatsSubjectPattern.SystemctlCommand,
      } as NatsRequest;
      const requestCodec = JSONCodec<NatsRequest>();
      console.log(`Starting ${item.service}`);
      const resMsg = await natsClient
        ?.request(req.subject, requestCodec.encode(req), {
          timeout: DEFAULT_NATS_TIMEOUT,
        })
        .catch((e) => {
          handleError(`Error starting ${item.service}`, e);
        });

      if (resMsg) {
        const eventStore = useEventStore();
        const successAlert: UiStickyAlert = {
          message: `${item.service} will start automatically.`,
          header: `Enabled ${item.service}`,
          actions: [],
        };
        eventStore.pushAlert(successAlert);
      }
    },
    async stopService(item: WidgetItem) {
      const natsStore = useNatsStore();
      if (natsStore.natsConnection === undefined) {
        console.warn("stopService called before NATS connection initialized");
        return;
      }
      const natsClient = toRaw(natsStore.natsConnection);
      const req = {
        service: item.service,
        command: SystemctlCommand.Stop,
        subject: NatsSubjectPattern.SystemctlCommand,
      } as NatsRequest;
      const requestCodec = JSONCodec<NatsRequest>();
      console.log(`Stopping ${item.service}`);
      const resMsg = await natsClient
        ?.request(req.subject, requestCodec.encode(req), {
          timeout: DEFAULT_NATS_TIMEOUT,
        })
        .catch((e) => {
          handleError(`Error stopping ${item.service}`, e);
        });

      if (resMsg) {
        const eventStore = useEventStore();
        const successAlert: UiStickyAlert = {
          message: `${item.service} will no longer start automatically.`,
          header: `Disabled ${item.service}`,
          actions: [],
        };
        eventStore.pushAlert(successAlert);
      }
    },
    async enableService(item: WidgetItem) {
      const natsStore = useNatsStore();

      if (natsStore.natsConnection === undefined) {
        console.warn("enableService called before NATS connection initialized");
        return;
      }
      const natsClient = toRaw(natsStore.natsConnection);
      const req = {
        service: item.service,
        command: SystemctlCommand.Enable,
        subject: NatsSubjectPattern.SystemctlCommand,
      } as NatsRequest;
      const requestCodec = JSONCodec<NatsRequest>();

      console.log(`Enabling ${item.service}`);
      const resMsg = await natsClient
        ?.request(req.subject, requestCodec.encode(req), {
          timeout: DEFAULT_NATS_TIMEOUT,
        })
        .catch((e) => {
          handleError(`Error enabling ${item.service}`, e);
        });

      if (resMsg) {
        const responseCodec = JSONCodec<NatsResponse>();
        const res = responseCodec.decode(resMsg.data);
        console.debug(`Successfully enabled ${item.service}`, res);

        const idx = this.items.findIndex((el) => el.service === item.service);

        await this.startService(item);
        await this.loadEnabledServices();
        await this.loadStatus(item, idx);
      }
    },

    async disableService(item: WidgetItem) {
      const natsStore = useNatsStore();

      if (natsStore.natsConnection === undefined) {
        console.warn(
          "disableService called before NATS connection initialized"
        );
        return;
      }
      const natsClient = toRaw(natsStore.natsConnection);

      const req = {
        service: item.service,
        command: SystemctlCommand.Disable,
        subject: NatsSubjectPattern.SystemctlCommand,
      } as NatsRequest;
      const requestCodec = JSONCodec<NatsRequest>();

      console.log(`Enabling ${item.service}`);
      const resMsg = await natsClient
        ?.request(req.subject, requestCodec.encode(req), {
          timeout: DEFAULT_NATS_TIMEOUT,
        })
        .catch((e) => {
          handleError(`Error disabling ${item.service}`, e);
        });

      if (resMsg) {
        const responseCodec = JSONCodec<NatsResponse>();
        const res = responseCodec.decode(resMsg.data);
        console.log(`Successfully enabled ${item.service}`, res);
        const idx = this.items.findIndex((el) => el.service === item.service);

        await this.stopService(item);
        await this.loadEnabledServices();
        await this.loadStatus(item, idx);
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWidgetStore, import.meta.hot));
}
