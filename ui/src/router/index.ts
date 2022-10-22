import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import posthog from "posthog-js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.afterEach((_to, _from) => {
  // https://posthog.com/docs/integrate/client/js#one-page-apps-and-page-views
  // send $pageview event
  posthog.capture("$pageview");
});

export default router;
