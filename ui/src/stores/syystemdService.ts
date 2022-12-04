import { retry } from '@lifeomic/attempt';
import { JSONCodec, type NatsConnection } from "nats.ws";

import { SystemdManagerGetUnitRequest, SystemdManagerGetUnitReply } from '@bitsy-ai/printnanny-asyncapi-models';

import type { WidgetItem } from "@/types";
import { defineStore, acceptHMRUpdate } from "pinia";
import { useNatsStore } from './nats';


export const useSystemdServiceStore = (service: string) => {
    const scopedStoreDefinition = defineStore(`systemd1/${service}`, {
        state: () => ({
            widget: undefined as undefined | WidgetItem,
        }),
        actions: {
            async load() {
                const natsStore = useNatsStore();
                const natsConnection = await natsStore.getNatsConnection();

                const requestCodec = JSONCodec<SystemdManagerGetUnitRequest>();


            }
        }
    })
    if (import.meta.hot) {
        import.meta.hot.accept(acceptHMRUpdate(scopedStoreDefinition, import.meta.hot));
    }
    return scopedStoreDefinition()
};