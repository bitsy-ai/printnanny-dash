import { defineStore, acceptHMRUpdate } from "pinia";
import * as api from "printnanny-api-client";

import { ExclamationTriangleIcon } from "@heroicons/vue/20/solid";
import { ApiConfig } from "@/utils/api";
import type { UiStickyAlert, AlertAction } from "@/types";
import { useRouter } from "vue-router";
import { useAlertStore } from "./alerts";

const accountsApi = api.AccountsApiFactory(ApiConfig);

export const useCloudStore = defineStore({
  id: "cloud",
  // persist option provided by: https://github.com/prazdevs/pinia-plugin-persistedstate
  persist: {
    storage: sessionStorage,
  },
  state: () => ({
    user: undefined as api.User | undefined,
  }),
  getters: {
    isAuthenticated: (state) => state.user !== undefined,
  },
  actions: {
    async fetchUser() {
      const userData = await accountsApi.accountsUserRetrieve().catch((e) => {
        console.warn(e);
      });
      if (userData && userData.data) {
        console.log("Authenticated as user", userData.data);
        this.$patch({
          user: userData.data,
        });
        return userData.data;
      } else {
        const alertStore = useAlertStore();
        const router = useRouter();

        const actions = [
          {
            color: "red",
            text: "Connect Account",
            routeName: "settings",
            onClick: () => {},
          },
        ] as Array<AlertAction>;
        const alert = {
          header: "PrintNanny Cloud - Account Not Linked",
          message: `Connect PrintNanny Cloud acccount to access ${window.location.host} from anywhere.`,
          actions: actions,
          icon: ExclamationTriangleIcon,
        } as UiStickyAlert;
        alertStore.pushAlert(alert);
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCloudStore, import.meta.hot));
}
