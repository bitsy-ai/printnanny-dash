import type { SystemdUnitStatus } from "./nats";

export enum WidgetCategory {
  PrinterManagement = "PrinterManagement",
  PrintNannyApps = "PrintNannyApps",
  OtherApps = "OtherApps",
}

export interface WidgetMenuItem {
  name: string;
  href: string;
}

export interface WidgetItem {
  name: string;
  href: string;
  logo: string;
  description: string;
  menuItems: Array<WidgetMenuItem>;
  service: string;
  category: WidgetCategory;
  status: SystemdUnitStatus;
  loaded: boolean;
  enabled?: boolean;
}

export interface DeviceInfo {
  issue: string;
  os_release: string;
  printnanny_cli_version: string;
}

export interface ConfigFile {
  filename: string
  path: string
  content: string
  syntax: string
}
