import { defineStore, acceptHMRUpdate } from "pinia";
import * as api from "printnanny-api-client";

import type { UiStickyAlert } from "@/types";

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
        console.warn(e)
      });
      if (userData && userData.data) {
        console.log("Authenticated as user", userData.data);
        this.$patch({
          user: userData.data,
        });
        return userData.data;
      }
    },
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCloudStore, import.meta.hot));
}
