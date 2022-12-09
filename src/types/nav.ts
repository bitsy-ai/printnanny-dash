export interface NavItem {
  name: string;
  href: string;
  current: boolean;
}

export interface NatsError {
  error: string;
  request: any;
  subject_pattern: string;
}
