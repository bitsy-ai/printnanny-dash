import { defineStore, acceptHMRUpdate } from "pinia";
import { toRaw } from "vue";

import { connect, JSONCodec, type NatsConnection } from "nats.ws";
import { handleError } from "@/utils";
import {
  ConnectionStatus,
  NatsSubjectPattern,
  renderNatsSubjectPattern
} from "@/types";
import type { PrintNannyCloudAuthRequest } from "@bitsy-ai/printnanny-asyncapi-models";

function getNatsURI() {
  const hostname = window.location.hostname;
  const uri = `ws://${hostname}:${import.meta.env.VITE_PRINTNANNY_EDGE_NATS_WS_PORT
    }`;
  return uri;
}

export const useNatsStore = defineStore({
  id: "nats",

  state: () => ({
    natsConnection: undefined as NatsConnection | undefined,
    status: ConnectionStatus.ConnectionNotStarted,
  }),

  actions: {
    async onConnected(_natsConnection: NatsConnection) {
      console.debug("NATS onConnected callback");
    },
    async connect(): Promise<NatsConnection | undefined> {
      // create nats connection if not initialized
      if (
        this.natsConnection === undefined &&
        this.status !== ConnectionStatus.ConnectionLoading
      ) {
        this.$patch({ status: ConnectionStatus.ConnectionLoading });
        const servers = [getNatsURI()];
        console.log(`Connecting to NATS server: ${servers}`);

        const connectOptions = {
          servers,
          debug: false,
        };

        if (import.meta.env.VITE_PRINTNANNY_DEBUG == true) {
          connectOptions.debug = true;
        }
        const natsConnection = await connect(connectOptions).catch((e: Error) =>
          handleError("Failed to connect to NATS server", e)
        );
        if (natsConnection) {
          console.log(`Initialized NATs connection to ${servers}`);
          this.$patch({
            natsConnection,
            status: ConnectionStatus.ConnectionReady,
          });
          return natsConnection;
        }
        this.$patch({ status: ConnectionStatus.ConnectionError });
      }
      return this.natsConnection;
    },
    async getNatsConnection(): Promise<NatsConnection> {
      while (this.natsConnection === undefined) {
        await this.connect();
        console.warn("Establishing NatsConnection...");
        await new Promise((r) => setTimeout(r, 2000));
      }
      const res = await this.connect();
      if (res === undefined) {
        throw Error("Failed to connect to NATS server");
      }
      return res;
    },
    async connectCloudAccount(
      email: string,
      api_token: string,
      api_url: string
    ) {
      const req: PrintNannyCloudAuthRequest = {
        email,
        api_token,
        api_url,
      };

      const subject = renderNatsSubjectPattern(
        NatsSubjectPattern.PrintNannyCloudAuth
      );

      const natsClient = toRaw(this.natsConnection);
      const jsonCodec = JSONCodec<PrintNannyCloudAuthRequest>();

      console.debug("Publishing NATS PrintNannyCloudAuthRequest:", req);
      const res = await natsClient
        ?.request(subject, jsonCodec.encode(req), {
          timeout: 120000, // 120 seconds
        })
        .catch((e) => handleError("Failed to sync with PrintNanny Cloud", e));

      console.log(
        "Success! Synced with PrintNanny Cloud. ConnectCloudAccountResponse:",
        res
      );
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNatsStore, import.meta.hot));
}
