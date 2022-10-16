import type { SystemdUnitStatus } from "./events";

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
