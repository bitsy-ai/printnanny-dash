import { defineStore, acceptHMRUpdate } from "pinia";
import * as api from "printnanny-api-client";

import { ExclamationTriangleIcon } from "@heroicons/vue/20/solid";
import type { UiStickyAlert, AlertAction } from "@/types";
import { useAlertStore } from "./alerts";
import { handleError } from "@/utils";

export const useCloudStore = defineStore({
  id: "cloud",
  // persist option provided by: https://github.com/prazdevs/pinia-plugin-persistedstate
  persist: {
    storage: sessionStorage,
  },
  state: () => ({
    user: undefined as api.User | undefined,
    token: undefined as string | undefined,
    apiConfig: new api.Configuration({
      basePath: import.meta.env.VITE_PRINTNANNY_CLOUD_API_URL,
    }),
  }),
  getters: {
    isAuthenticated: (state) => state.user !== undefined,
  },
  actions: {
    async twoFactorStage1(email: String): Promise<boolean> {
      const accountsApi = api.AccountsApiFactory(this.apiConfig);

      const req = { email } as api.EmailAuthRequest;
      const res = await accountsApi
        .accounts2faAuthEmailCreate(req)
        .catch((e) => handleError("Error", e));
      console.debug("accounts2faAuthEmailCreate response: ", res);
      return res !== undefined && res.status == 200;
    },

    async twoFactorStage2(email: String, token: String): Promise<boolean> {
      const accountsApi = api.AccountsApiFactory(this.apiConfig);

      const req = { email, token } as api.CallbackTokenAuthRequest;
      const res = await accountsApi
        .accounts2faAuthTokenCreate(req)
        .catch((e) => {
          if (e.response.status === 400) {
            handleError("Incorrect code", e);
          } else {
            handleError("Error", e);
          }
        });
      console.debug("accounts2faAuthTokenCreate response: ", res);
      const ok = res !== undefined && res.status === 200;
      if (ok) {
        const token = res.data.token;
        const apiConfig = new api.Configuration({
          basePath: import.meta.env.VITE_PRINTNANNY_CLOUD_API_URL,
          baseOptions: {
            headers: { Authorization: `Bearer ${token}` },
          },
        });

        this.$patch({ token, apiConfig });
      }
      return ok;
    },

    async fetchUser() {
      const accountsApi = api.AccountsApiFactory(this.apiConfig);

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

        const actions = [
          {
            color: "red",
            text: "Connect Account",
            routeName: "Settings",
            onClick: () => { },
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
