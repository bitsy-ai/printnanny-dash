export enum NatsSubjectPattern {
  DataframeRow = "pi.qc.df",
  SystemctlCommand = "pi.command.systemctl",
  GstPipelineConfig = "pi.command.gst_pipeline_config",
  ConnectCloudAccount = "pi.command.connect_cloud_connect",
}

export enum SystemdUnitStatus {
  Active = "active",
  Inactive = "inactive",
  Unknown = "unknown",
  Error = "error",
}

export enum ConnectionStatus {
  ConnectionNotStarted,
  ConnectionLoading,
  ConnectionReady,
  ConnectionError,
  ConnectionClosing,
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

export interface SystemctlCommandRequest {
  subject: string;
  service: string;
  command: SystemctlCommand;
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
  data: { [key: string]: any };
}

export interface GstPipelineConfigRequest {
  subject: string;
  json: string; //
  pre_save: Array<SystemctlCommandRequest>;
  post_save: Array<SystemctlCommandRequest>;
}

export interface GstPipelineConfigResponse {
  subject: string;
  status: ResponseStatus;
  request?: GstPipelineConfigRequest;
  detail: string;
  pre_save: Array<SystemctlCommandResponse>;
  post_save: Array<SystemctlCommandResponse>;
}

export interface ConnectCloudAccountRequest {
  subject: string;
  api_uri: string;
  api_token: string;
  email: string;
}

export interface ConnectCloudAccountResponse {
  subject: string;
  status: ResponseStatus;
  detail: string;
  request?: ConnectCloudAccountRequest;
}

export type NatsRequest =
  | SystemctlCommandRequest
  | GstPipelineConfigRequest
  | ConnectCloudAccountRequest;
export type NatsResponse =
  | SystemctlCommandResponse
  | GstPipelineConfigResponse
  | ConnectCloudAccountResponse;
