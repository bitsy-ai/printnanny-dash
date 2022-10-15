import type { FunctionalComponent, HTMLAttributes, VNodeProps } from "vue";

export interface AlertAction {
  color: string;
  text: string;
  onClick: () => void;
}

export interface DetectionAlert {
  color: string;
  header: string;
  description: string;
  icon: FunctionalComponent<HTMLAttributes & VNodeProps>;
}

export interface UiStickyAlert {
  message: string;
  header: string;
  icon?: FunctionalComponent<HTMLAttributes & VNodeProps>;
  actions: Array<AlertAction>;
  error: Error | undefined | string;
}
