export enum NatsSubjectPattern {
  DataframeRow = "pi.qc.df",
  SystemctlCommand = "pi.command.systemctl",
  GstPipelineSettings = "pi.command.settings.gst_pipeline",
  ConnectCloudAccount = "pi.command.connect_cloud_account",
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

export interface GstPipelineSettingsRequest {
  subject: string;
  json: string; //
  pre_save: Array<SystemctlCommandRequest>;
  post_save: Array<SystemctlCommandRequest>;
}

export interface GstPipelineSettingsResponse {
  subject: string;
  status: ResponseStatus;
  request?: GstPipelineSettingsRequest;
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
  | GstPipelineSettingsRequest
  | ConnectCloudAccountRequest;
export type NatsResponse =
  | SystemctlCommandResponse
  | GstPipelineSettingsResponse
  | ConnectCloudAccountResponse;
