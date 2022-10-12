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
}
