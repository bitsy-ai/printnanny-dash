import type { SystemdUnit } from "@bitsy-ai/printnanny-asyncapi-models";

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
  error?: Error;
}

export interface ConfigFile {
  filename: string;
  path: string;
  content: string;
  syntax: string;
}
