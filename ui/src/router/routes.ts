import TopNav from "@/components/nav/TopNav.vue";
import type { RouteRecordRaw } from "vue-router";

const TopBarRoutes = [
  {
    path: "/",
    name: "Home",
    components: {
      default: () => import("@/views/HomeView.vue"),
      TopNav: TopNav,
    },
  },
  {
    path: "/vision",
    name: "PrintNanny Vision",
    components: {
      default: () => import("@/views/VideoView.vue"),
      TopNav: TopNav,
    },
  },
];

const AllRoutes = [
  {
    path: "/login",
    name: "login",
    components: {
      default: () => import("@/views/LoginView.vue"),
    },
  },
  {
    path: "/settings",
    name: "Settings",
    components: {
      default: () => import("@/views/SettingsView.vue"),
      TopNav: TopNav,
    },
  },
  {
    path: "/config",
    name: "Config",
    components: {
      default: () => import("@/views/ConfigView.vue"),
      TopNav: TopNav,
    },
  },
].concat(TopBarRoutes) as RouteRecordRaw[];

export { AllRoutes, TopBarRoutes };
