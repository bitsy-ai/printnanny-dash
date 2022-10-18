import { defineStore, acceptHMRUpdate } from "pinia";

import type { NatsConnection } from "nats.ws";
import { connect } from "nats.ws";
import { handleError } from "@/utils";
import { ConnectionStatus } from "@/types";

function getNatsURI() {
  const hostname = window.location.hostname;
  const uri = `ws://${hostname}:${import.meta.env.VITE_PRINTNANNY_EDGE_NATS_WS_PORT
    }`;
  console.log(`Connecting to NATS server: ${uri}`);
  return uri;
}

export const useNatsStore = defineStore({
  id: "nats",

  state: () => ({
    natsConnection: undefined as NatsConnection | undefined,
    status: ConnectionStatus.ConnectionNotStarted
  }),

  actions: {
    async connect(): Promise<boolean> {
      this.$patch({ status: ConnectionStatus.ConnectionLoading });

      // create nats connection if not initialized
      if (this.natsConnection === undefined) {
        const servers = [getNatsURI()];
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
          this.$patch({ natsConnection, status: ConnectionStatus.ConnectionReady });
          return true;
        }
        this.$patch({ status: ConnectionStatus.ConnectionError })
        return false;
      } else {
        return true;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNatsStore, import.meta.hot));
}
