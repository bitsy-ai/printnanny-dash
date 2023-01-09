import { defineStore, acceptHMRUpdate } from "pinia";
import * as api from "printnanny-api-client";
import { handleError } from "@/utils";
import { useNatsStore } from "./nats";
import { posthogIdentify } from "@/utils/posthog";

export const useCloudStore = defineStore({
  id: "cloud",
  // persist option provided by: https://github.com/prazdevs/pinia-plugin-persistedstate
  persist: {
    storage: localStorage, // localStorage is available to all browser tabs, and isn't cleared when browsing session ends
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

    async twoFactorStage2(email: string, token: string): Promise<boolean> {
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

        console.log(`Success! Authenticated as ${email}`);
        this.$patch({ token, apiConfig });
        await this.fetchUser();
        await this.connectCloudAccount();
      }
      return ok;
    },

    async connectCloudAccount() {
      if (this.user && this.token) {
        const natsStore = useNatsStore();
        await natsStore.connectCloudAccount(
          this.user.email,
          this.token,
          import.meta.env.VITE_PRINTNANNY_CLOUD_API_URL
        );
      } else
        [
          console.log(
            "connectCloudAccount called but CloudStore.user is not set"
          ),
        ];
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
        posthogIdentify(userData.data);
        return userData.data;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCloudStore, import.meta.hot));
}
