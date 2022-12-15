export enum NatsSubjectPattern {
  CamerasLoad = "pi.{pi_id}.cameras.load",
  DeviceInfoLoad = "pi.{pi_id}.device_info.load",
  DataframeRow = "pi.qc.df",

  SystemdManagerGetUnit = "pi.{pi_id}.dbus.org.freedesktop.systemd1.Manager.GetUnit",
  SystemdManagerGetUnitFileState = "pi.{pi_id}.dbus.org.freedesktop.systemd1.Manager.GetUnitFileState",

  SystemdManagerDisableUnits = "pi.{pi_id}.dbus.org.freedesktop.systemd1.Manager.DisableUnit",
  SystemdManagerEnableUnits = "pi.{pi_id}.dbus.org.freedesktop.systemd1.Manager.EnableUnit",
  SystemdManagerStartUnit = "pi.{pi_id}.dbus.org.freedesktop.systemd1.Manager.StartUnit",
  SystemdManagerStopUnit = "pi.{pi_id}.dbus.org.freedesktop.systemd1.Manager.StopUnit",
  SettingsLoad = "pi.{pi_id}.settings.file.load",
  SettingsApply = "pi.{pi_id}.settings.file.apply",
  SettingsRevert = "pi.{pi_id}.settings.file.revert",
  PrintNannyCloudAuth = "pi.{pi_id}.settings.printnanny.cloud.auth",
  WebrtcSettingsApply = "pi.{pi_id}.settings.webrtc.apply",
}

export function renderNatsSubjectPattern(pattern: NatsSubjectPattern): string {
  const pi = window.location.hostname.replace(".local", "");
  return pattern.replace("{pi_id}", pi);
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

export enum ResponseStatus {
  Ok = "ok",
  Error = "error",
}
