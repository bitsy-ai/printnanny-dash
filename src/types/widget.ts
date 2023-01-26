import ocotoprintLogo from "@/assets/logos/octoprint/octoprint_logo_rgb_250px.png";
import mainsailLogo from "@/assets/logos/mainsail/icon-192-maskable.png";
import printNannyLogo from "@/assets/logos/printnanny/logo.svg";
import syncThingLogo from "@/assets/logos/syncthing/logo-256.png";
// import moonrakerLogo from "@/assets/logos/moonraker/moonraker-512x512.png";
// import klipperLogo from "@/assets/logos/klipper/klipper.svg";
import tailscaleLogo from "@/assets/logos/tailscale/tailscale-512.png";
import { SettingsApp } from "@bitsy-ai/printnanny-asyncapi-models";

import { SystemdUnitStatus } from "./nats";

export enum WidgetCategory {
  PrinterManagement = "PrinterManagement",
  PrintNannyApps = "PrintNannyApps",
  OtherApps = "OtherApps",
  Internal = "Internal"
}

export interface WidgetMenuItem {
  name: string;
  href: string;
}

export interface WidgetItem {
  name: string;
  href: string;
  logo?: string;
  description: string;
  menuItems: Array<WidgetMenuItem>;
  service: string;
  category: WidgetCategory;
  settings?: {
    name: string;
    params: any;
  };
  error?: Error;
}

export interface ConfigFile {
  filename: string;
  path: string;
  content: string;
  syntax: string;
}

export const WIDGETS = {
  "octoprint": {
    name: "OctoPrint",
    settings: {
      name: "edit-settings-files",
      params: { app: SettingsApp.OCTOPRINT },
    },
    loaded: false,
    href: "/octoprint/",
    service: "octoprint.service",
    logo: ocotoprintLogo,
    description: "The snappy web interface for your 3D Printer",
    category: WidgetCategory.PrinterManagement,
    status: SystemdUnitStatus.Unknown,
    enabled: undefined,
    menuItems: [
      { name: "Documentation", href: "https://docs.octoprint.org" },
      { name: "Plugin Repo", href: "https://plugins.octoprint.org" },
      { name: "/r/octoprint", href: "https://www.reddit.com/r/octoprint/" },
      {
        name: "OctoPrint Community",
        href: "https://community.octoprint.org/",
      },
      { name: "Discord", href: "https://discord.octoprint.org/" },
    ],
  } as WidgetItem,
  "mainsail": {
    name: "Mainsail",
    settings: {
      name: "edit-settings-files",
      params: { app: SettingsApp.KLIPPER },
    },
    href: "/mainsail/",
    loaded: false,
    service: "mainsail.target",
    logo: mainsailLogo,
    category: WidgetCategory.PrinterManagement,
    enabled: undefined,
    status: SystemdUnitStatus.Unknown,
    description:
      "Mainsail makes Klipper more accessible by adding a lightweight, responsive web user interface.",
    menuItems: [
      {
        name: "Mainsail Documentation",
        href: "https://docs.mainsail.xyz/",
      },
      { name: "Mainsail Discord", href: "https://discord.gg/skWTwTD" },
      {
        name: "Moonraker Documentation",
        href: "https://moonraker.readthedocs.io/en/latest/",
      },
      {
        name: "Klipper Documentation",
        href: "https://moonraker.readthedocs.io/en/latest/",
      },
      { name: "/r/klippers", href: "https://www.reddit.com/r/klippers/" },
    ],
  } as WidgetItem,
  // {
  //   name: "Moonraker",
  //   href: "/mainsail/server",
  //   loaded: false,
  //   service: "moonraker.service",
  //   logo: moonrakerLogo,
  //   category: WidgetCategory.PrinterManagement,
  //   enabled: undefined,
  //   status: SystemdUnitStatus.Unknown,
  //   description:
  //     "Moonraker is an API with used to interact with the 3D printing firmware Klipper.",
  //   menuItems: [
  //     { name: "Documentation", href: "https://moonraker.readthedocs.io/en/latest/" },
  //     { name: "/r/klippers", href: "https://www.reddit.com/r/klippers/" },
  //     {
  //       name: "Github Issues",
  //       href: "https://github.com/Arksine/moonraker/issues",
  //     },
  //   ],
  // } as WidgetItem,
  // {
  //   name: "Klipper",
  //   href: "/mainsail/server",
  //   loaded: false,
  //   service: "klipper.service",
  //   logo: klipperLogo,
  //   category: WidgetCategory.PrinterManagement,
  //   enabled: undefined,
  //   status: SystemdUnitStatus.Unknown,
  //   description:
  //     "Klipper is a 3D-Printer firmware.",
  //   menuItems: [
  //     { name: "Documentation", href: "https://www.klipper3d.org/Overview.html" },
  //     {
  //       name: "Github Issues",
  //       href: "https://github.com/Klipper3d/klipper/issues",
  //     },
  //   ],
  // } as WidgetItem,
  "printnanny-cam": {
    name: "PrintNanny Cam",
    loaded: false,
    href: "/cam/",
    settings: {
      name: "camera-settings",
      params: { app: SettingsApp.PRINTNANNY },
    },
    service: "printnanny-vision.service",
    logo: printNannyLogo,
    category: WidgetCategory.PrintNannyApps,
    enabled: undefined,
    status: SystemdUnitStatus.Unknown,
    description:
      "The privacy-first defect and failure detection system. No internet connection required.",
    menuItems: [],
  } as WidgetItem,
  "printnanny-cloud": {
    name: "PrintNanny Cloud",
    loaded: false,
    settings: {
      name: "camera-settings",
      params: { app: SettingsApp.PRINTNANNY },
    },
    href: "https://printnanny.ai/devices",
    service: "printnanny-cloud.target",
    logo: printNannyLogo,
    category: WidgetCategory.PrintNannyApps,
    enabled: undefined,
    status: SystemdUnitStatus.Unknown,
    description:
      "Get email notifications, view camera feed from anywhere, and sync settings with PrintNanny Cloud.",
    menuItems: [],
  } as WidgetItem,
  "swupdate": {
    name: "OS Updates",
    loaded: false,
    href: "/update/",
    service: "swupdate.service",
    logo: printNannyLogo,
    category: WidgetCategory.PrintNannyApps,
    enabled: undefined,
    status: SystemdUnitStatus.Unknown,
    description: "Update PrintNanny OS to the latest build.",
    menuItems: [
      {
        name: "How to Update PrintNanny OS",
        href: "https://printnanny.ai/docs/docs/update-printnanny-os/",
      },
    ],
  } as WidgetItem,
  "syncthing": {
    name: "Syncthing",
    href: "/syncthing/",
    logo: syncThingLogo,
    category: WidgetCategory.OtherApps,
    status: SystemdUnitStatus.Unknown,
    enabled: undefined,
    description:
      "Sync files between two or more computers. Like having a private Dropbox.",
    service: "syncthing@printnanny.service",
    menuItems: [
      {
        name: "Quick Start",
        href: "https://printnanny.ai/docs/docs/quick-start/configure-file-sync/",
      },
      { name: "Syncthing Docs", href: "https://docs.syncthing.net/" },
      { name: "Commmunity Forum", href: "https://forum.syncthing.net/" },
    ],
  } as WidgetItem,
  "tailscale": {
    name: "Tailscale",
    href: "https://login.tailscale.com/admin/welcome",
    logo: tailscaleLogo,
    category: WidgetCategory.OtherApps,
    status: SystemdUnitStatus.Unknown,
    enabled: undefined,
    description:
      "Tailscale lets you easily manage access to private resources and work securely from anywhere in the world.",
    service: "tailscaled.service",
    menuItems: [
      {
        name: "Add Device to Network",
        href: "/tailscale/",
      },
      {
        name: "Quick Start",
        href: "https://printnanny.ai/docs/docs/addons/tailscale/",
      },
      { name: "Tailscale Docs", href: "https://tailscale.com/kb/" },
    ],
  } as WidgetItem,
  "gstd": {
    name: "Gstreamer Daemon",
    href: "",
    logo: undefined,
    category: WidgetCategory.Internal,
    status: SystemdUnitStatus.Unknown,
    enabled: undefined,
    description: "",
    service: "gstd.service",
    menuItems: [],
  } as WidgetItem
};