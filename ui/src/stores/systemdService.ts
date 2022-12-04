import { retry } from '@lifeomic/attempt';
import { JSONCodec, type NatsConnection } from "nats.ws";

import { SystemdManagerGetUnitRequest, SystemdManagerGetUnitReply, SystemdUnit } from '@bitsy-ai/printnanny-asyncapi-models';

import { NatsSubjectPattern, type WidgetItem } from "@/types";
import { defineStore, acceptHMRUpdate } from "pinia";
import { useNatsStore } from './nats';
import { handleError } from "@/utils";


export const useSystemdServiceStore = (widget: WidgetItem) => {
    const scopedStoreDefinition = defineStore(`systemd1/${widget.service}`, {
        state: () => ({
            widget: widget,
            unit: undefined as undefined | SystemdUnit
        }),
        actions: {
            async load() {
                const natsStore = useNatsStore();
                const natsConnection = await natsStore.getNatsConnection();

                const requestCodec = JSONCodec<SystemdManagerGetUnitRequest>();

                const req = { unit_name: this.widget?.service } as SystemdManagerGetUnitRequest
                const resMsg = await natsConnection?.request(
                    NatsSubjectPattern.SystemdManagerGetUnit,
                    requestCodec.encode(req)
                ).catch((e) => {
                    const msg = `Error loading ${this.widget?.service}`;
                    handleError(msg, e)
                });

                if (resMsg) {
                    const resCodec = JSONCodec<SystemdManagerGetUnitReply>();
                    const res = resCodec.decode(resMsg?.data);
                    this.$patch({ unit: res.unit })
                }
            }
        }
    })
    if (import.meta.hot) {
        import.meta.hot.accept(acceptHMRUpdate(scopedStoreDefinition, import.meta.hot));
    }
    return scopedStoreDefinition()
};