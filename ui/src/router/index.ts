import { createRouter, createWebHistory } from "vue-router";
import posthog from "posthog-js";
import { useCloudStore } from "@/stores/cloud";
import { AllRoutes } from "./routes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: AllRoutes,
});

router.afterEach((_to, _from) => {
  // https://posthog.com/docs/integrate/client/js#one-page-apps-and-page-views
  // send $pageview event
  posthog.capture("$pageview");
});

router.beforeEach(async (to, _from) => {
  const cloud = useCloudStore();
  await cloud.fetchUser();

  // redirect unauthenticated users
  if (
    // make sure the user is authenticated before proceeding to dashboard
    !cloud.isAuthenticated &&
    // ❗️ Avoid an infinite redirect
    to.name !== "login"
  ) {
    // redirect to login
    return { name: "login" };
  }

  // redirect authenticated users home
  if (cloud.isAuthenticated && to.name == "login") {
    return { name: "Home" };
  }
});

export default router;
