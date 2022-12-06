import { retry } from "@lifeomic/attempt";
import { JSONCodec, NatsError, type NatsConnection } from "nats.ws";

import {
    type SystemdManagerGetUnitRequest,
    type SystemdManagerGetUnitError,
    type SystemdManagerGetUnitReply,
} from "@bitsy-ai/printnanny-asyncapi-models";

import {
    NatsSubjectPattern,
    renderNatsSubjectPattern,
    type WidgetItem,
} from "@/types";
import { defineStore, acceptHMRUpdate } from "pinia";
import { useNatsStore } from "./nats";
import { handleError } from "@/utils";

const DEFAULT_NATS_TIMEOUT = 12000;


function isSystemdManagerGetUnitError(res: SystemdManagerGetUnitReply | SystemdManagerGetUnitError) {
    return (res as SystemdManagerGetUnitError).error !== undefined
}


export const useSystemdServiceStore = (widget: WidgetItem) => {
    const scopedStoreDefinition = defineStore(`systemd1/${widget.service}`, {
        state: () => ({
            widget: widget,
            loading: true,
        }),
        actions: {
            async enableService() { },
            async disableService() { },
            async load() {
                const natsStore = useNatsStore();
                const natsConnection: NatsConnection = await natsStore.getNatsConnection();
                const subject = renderNatsSubjectPattern(
                    NatsSubjectPattern.SystemdManagerGetUnit
                );

                const requestCodec = JSONCodec<SystemdManagerGetUnitRequest>();

                const req = {
                    unit_name: this.widget?.service,
                } as SystemdManagerGetUnitRequest;
                console.log(`Sending request to ${subject}`, req);
                const resMsg = await natsConnection
                    ?.request(subject, requestCodec.encode(req), {
                        timeout: DEFAULT_NATS_TIMEOUT,
                    })
                    .catch((e) => {
                        const msg = `Error loading ${this.widget?.service}`;
                        handleError(msg, e);
                    });

                if (resMsg) {
                    const resCodec = JSONCodec<SystemdManagerGetUnitReply | SystemdManagerGetUnitError>();
                    let res = resCodec.decode(resMsg?.data);
                    console.log(`Received reply to ${subject}`, res);

                    if (isSystemdManagerGetUnitError(res)) {
                        res = res as SystemdManagerGetUnitError;
                        const error = new Error(res.error);
                        const msg = `Error enabling ${this.widget.service}`;
                        handleError(msg, error);
                        this.$patch({ widget: { error } });
                    } else {
                        res = res as SystemdManagerGetUnitReply;
                        this.$patch({ widget: { unit: res.unit } });
                    }
                }
                this.$patch({ loading: false });
            },
        },
    });
    if (import.meta.hot) {
        import.meta.hot.accept(
            acceptHMRUpdate(scopedStoreDefinition, import.meta.hot)
        );
    }
    return scopedStoreDefinition();
};
