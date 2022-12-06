import { JSONCodec, type NatsConnection } from "nats.ws";

import type {
    SystemdManagerGetUnitRequest,
    SystemdManagerGetUnitError,
    SystemdManagerGetUnitReply,
    SystemdManagerEnableUnitsReply,
    SystemdManagerEnableUnitsRequest,
    SystemdManagerEnableUnitsError,
    SystemdManagerDisableUnitsReply,
    SystemdManagerDisableUnitsRequest,
    SystemdManagerDisableUnitsError,
    SystemdUnit
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

function isSystemdManagerGetUnitError(
    res: SystemdManagerGetUnitReply | SystemdManagerGetUnitError
) {
    return (res as SystemdManagerGetUnitError).error !== undefined;
}

function isSystemdManagerEnableUnitError(
    res: SystemdManagerEnableUnitsReply | SystemdManagerEnableUnitsError
) {
    return (res as SystemdManagerEnableUnitsError).error !== undefined;
}

export const useSystemdServiceStore = (widget: WidgetItem) => {
    const scopedStoreDefinition = defineStore(`systemd1/${widget.service}`, {
        state: () => ({
            widget: widget,
            loading: true,
            unit: null as null | SystemdUnit,
            error: null as null | Error,
        }),
        actions: {
            async enableService() {
                // get nats connection (awaits until NATS server is available)
                const natsStore = useNatsStore();
                const natsConnection: NatsConnection =
                    await natsStore.getNatsConnection();

                const subject = renderNatsSubjectPattern(
                    NatsSubjectPattern.SystemdManagerEnableUnits
                );

                const requestCodec = JSONCodec<SystemdManagerEnableUnitsRequest>();

                const req = {
                    files: [this.widget.service],
                } as SystemdManagerEnableUnitsRequest;
                console.log(`Sending request to ${subject}`, req);
                const resMsg = await natsConnection
                    ?.request(subject, requestCodec.encode(req), {
                        timeout: DEFAULT_NATS_TIMEOUT,
                    })
                    .catch((e) => {
                        const msg = `Error enabling ${this.widget?.service}`;
                        handleError(msg, e);
                    });

                if (resMsg) {
                    const resCodec = JSONCodec<
                        SystemdManagerEnableUnitsReply | SystemdManagerEnableUnitsError
                    >();
                    let res = resCodec.decode(resMsg?.data);
                    console.log(`Received reply to ${subject}`, res);

                    if (isSystemdManagerEnableUnitError(res)) {
                        res = res as SystemdManagerEnableUnitsError;
                        const error = new Error(res.error);
                        const msg = `Error enabling ${this.widget.service}`;
                        handleError(msg, error);
                        this.$patch({ error });
                    } else {
                        res = res as SystemdManagerEnableUnitsReply;
                        console.log(
                            `Enabled ${widget.service}, with changes:`,
                            res.changes
                        );
                    }
                }
            },
            async disableService() {
                // get nats connection (awaits until NATS server is available)
                const natsStore = useNatsStore();
                const natsConnection: NatsConnection =
                    await natsStore.getNatsConnection();

                const subject = renderNatsSubjectPattern(
                    NatsSubjectPattern.SystemdManagerDisableUnits
                );

                const requestCodec = JSONCodec<SystemdManagerDisableUnitsRequest>();
                const req = {
                    files: [this.widget.service],
                } as SystemdManagerDisableUnitsRequest;
                console.log(`Sending request to ${subject}`, req);
                const resMsg = await natsConnection
                    ?.request(subject, requestCodec.encode(req), {
                        timeout: DEFAULT_NATS_TIMEOUT,
                    })
                    .catch((e) => {
                        const msg = `Error enabling ${this.widget?.service}`;
                        handleError(msg, e);
                    });
                if (resMsg) {
                    const resCodec = JSONCodec<
                        SystemdManagerDisableUnitsReply | SystemdManagerDisableUnitsError
                    >();
                    let res = resCodec.decode(resMsg?.data);
                    console.log(`Received reply to ${subject}`, res);

                    if (isSystemdManagerEnableUnitError(res)) {
                        res = res as SystemdManagerEnableUnitsError;
                        const error = new Error(res.error);
                        const msg = `Error enabling ${this.widget.service}`;
                        handleError(msg, error);
                        this.$patch({ error });
                    } else {
                        res = res as SystemdManagerEnableUnitsReply;
                        console.log(
                            `Enabled ${widget.service}, with changes:`,
                            res.changes
                        );
                    }
                }
            },
            async load() {
                const natsStore = useNatsStore();
                const natsConnection: NatsConnection =
                    await natsStore.getNatsConnection();
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
                    const resCodec = JSONCodec<
                        SystemdManagerGetUnitReply | SystemdManagerGetUnitError
                    >();
                    let res = resCodec.decode(resMsg?.data);
                    console.log(`Received reply to ${subject}`, res);

                    if (isSystemdManagerGetUnitError(res)) {
                        res = res as SystemdManagerGetUnitError;
                        const error = new Error(res.error);
                        const msg = `Error enabling ${this.widget.service}`;
                        handleError(msg, error);
                        this.$patch({ error });
                    } else {
                        res = res as SystemdManagerGetUnitReply;
                        this.$patch({ unit: res.unit });
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
