export enum NatsSubjectPattern {
  CameraSettingsLoad = "pi.{pi_id}.settings.camera.load",
  CameraSettingsApply = "pi.{pi_id}.settings.camera.apply",
  CameraSettingsRevert = "pi.{pi_id}.settings.camera.revert",

  CamerasLoad = "pi.{pi_id}.cameras.load",
  DeviceInfoLoad = "pi.{pi_id}.device_info.load",
  DataframeRow = "pi.qc.df",

  SystemdManagerGetUnit = "pi.{pi_id}.dbus.org.freedesktop.systemd1.Manager.GetUnit",
  SystemdManagerGetUnitFileState = "pi.{pi_id}.dbus.org.freedesktop.systemd1.Manager.GetUnitFileState",

  SystemdManagerDisableUnits = "pi.{pi_id}.dbus.org.freedesktop.systemd1.Manager.DisableUnit",
  SystemdManagerEnableUnits = "pi.{pi_id}.dbus.org.freedesktop.systemd1.Manager.EnableUnit",
  SystemdManagerStartUnit = "pi.{pi_id}.dbus.org.freedesktop.systemd1.Manager.StartUnit",
  SystemdManagerStopUnit = "pi.{pi_id}.dbus.org.freedesktop.systemd1.Manager.StopUnit",
  SettingsFileLoad = "pi.{pi_id}.settings.file.load",
  SettingsFileApply = "pi.{pi_id}.settings.file.apply",
  SettingsApplyRevert = "pi.{pi_id}.settings.file.revert",
  PrintNannyCloudAuth = "pi.{pi_id}.settings.printnanny.cloud.auth",
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
  ServiceNotStarted,
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
