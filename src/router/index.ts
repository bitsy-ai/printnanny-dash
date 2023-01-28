import { createRouter, createWebHistory } from "vue-router";
import posthog from "posthog-js";
import { useCloudStore } from "@/stores/cloud";
import { AllRoutes } from "./routes";
import { printnannyReady } from "@/utils/ready";

const router = createRouter({
  history: createWebHistory(),
  routes: AllRoutes,
});

router.afterEach((_to, _from) => {
  // https://posthog.com/docs/integrate/client/js#one-page-apps-and-page-views
  // send $pageview event
  posthog.capture("$pageview");
});

router.beforeEach(async (to, _from) => {
  // if we're redirecting to startup splash, continue
  if (to.name == "startup") { return }
  // is PrintNanny OS finished starting up?
  const ready = printnannyReady();
  if (ready === false) {
    return { name: "startup" }
  }

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

  // redirect base /settings view to /settings/printnanny/
  if (to.name === "settings") {
    return { name: "printnanny-account" };
  }
});

export default router;
