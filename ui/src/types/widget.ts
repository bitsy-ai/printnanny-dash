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
  enabled: boolean;
  name: string;
  href: string;
  logo: string;
  description: string;
  menuItems: Array<WidgetMenuItem>;
  service: string;
  category: WidgetCategory;
  status: SystemdUnitStatus;
}

export interface DeviceInfo {
  issue: string;
  os_release: string;
  printnanny_cli_version: string;
}
