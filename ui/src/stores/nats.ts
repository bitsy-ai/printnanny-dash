import { defineStore, acceptHMRUpdate } from "pinia";

import type { NatsConnection, Subscription } from "nats.ws";
import { connect, JSONCodec } from "nats.ws";
import { handleError } from "@/utils";


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

  }),

  actions: {
    async connect(): Promise<boolean> {
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
          this.$patch({ natsConnection });
          return true;
        }
        return false;
      } else {
        return true;
      }
    },
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNatsStore, import.meta.hot));
}
