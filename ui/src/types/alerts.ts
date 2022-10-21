import type { FunctionalComponent, HTMLAttributes, VNodeProps } from "vue";

export interface AlertAction {
  color: string;
  text: string;
  onClick: () => void;
  routeName?: string;
}

export interface UiStickyAlert {
  message: string;
  header: string;
  actions: Array<AlertAction>;
  error?: Error | undefined | string;
  icon?: FunctionalComponent<HTMLAttributes & VNodeProps>;
  color?: string;
}
