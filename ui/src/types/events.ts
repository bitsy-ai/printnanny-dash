export interface JanusMedia {
  age_ms: number;
  codec: string;
  label: string;
  mid: string;
  mindex: number;
  port: number;
  pt: number;
  rtpmap: string;
  type: string;
}

export interface JanusStreamMetadata {
  path: string;
}
export interface JanusStream {
  description: string;
  enabled: boolean;
  id: number;
  media: Array<JanusMedia>;
  metadata: JanusStreamMetadata;
  name: string;
  type: string;
  viewers: number;
}

export enum NatsSubjectPattern {
  DataframeRow = "pi.qc.df",
  SystemctlCommand = "pi.command.systemctl",
  MediaCommand = "pi.command.media",
}

export interface QcDataframeRow {
  adhesion__count: number;
  adhesion__mean: number;
  adhesion__std: number;
  nozzle__count: number;
  nozzle__mean: number;
  nozzle__std: number;
  print__count: number;
  print__mean: number;
  print__std: number;
  raft__count: number;
  raft__mean: number;
  raft__std: number;
  spaghetti__mean: number;
  spaghetti__count: number;
  spaghetti__std: number;
  detection_scores: number;
  ts: number;
}

export enum SystemdUnitStatus {
  Active = "active",
  Inactive = "inactive",
  Unknown = "unknown",
}

export enum ConnectionStatus {
  ConnectionNotStarted,
  ConnectionLoading,
  ConnectionReady,
  ConnectionStreamLoading,
  ConnectionStreamReady,
  ConnectionError,
}

export enum SystemctlCommand {
  Start = "start",
  Stop = "stop",
  Restart = "restart",
  Status = "status",
  Enable = "enable",
  Disable = "disable",
  ListEnabled = "list_enabled",
}

export enum MediaCommand {
  Start = "start",
  Stop = "stop",
}

export interface SystemctlCommandRequest {
  subject: string;
  service: string;
  command: SystemctlCommand;
}

export interface MediaCommandRequest {
  subject: string;
  service: string;
  janus_stream: JanusStream;
  command: MediaCommand;
}

export enum ResponseStatus {
  Ok = "ok",
  Error = "error",
}

export interface SystemctlCommandResponse {
  subject: string;
  status: ResponseStatus;
  request?: SystemctlCommandRequest;
  detail: string;
  data: Map<string, any>;
}

export interface MediaCommandResponse {
  subject: string;
  status: ResponseStatus;
  request?: MediaCommandRequest;
  detail: string;
  data: Map<string, any>;
}

export type NatsRequest = SystemctlCommandRequest;
export type NatsResponse = SystemctlCommandResponse;
