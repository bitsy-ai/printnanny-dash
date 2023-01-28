import { useSystemdServiceStore } from "@/stores/systemdService";
import { WIDGETS } from "@/types";
import { SystemdUnitActiveState } from "@bitsy-ai/printnanny-asyncapi-models";
const timeout = 300000; // 5 minutes in ms
const interval = 2000; // 2 seconds

// polls status of printnanny-online.target systemd unit. used to re-route to splash screen if PrintNanny OS is still starting up
export function printnannyReady(): boolean {
  const widget = WIDGETS["printnanny-online"];
  const store = useSystemdServiceStore(widget, true);
  return store.unit?.active_state === SystemdUnitActiveState.ACTIVE;
}
