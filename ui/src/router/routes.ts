import TopNav from "@/components/nav/TopNav.vue";

const TopBarRoutes = [
  {
    path: "/",
    name: "Home",
    components: {
      default: () => import("../views/HomeView.vue"),
      TopNav: TopNav,
    },
  },
  {
    path: "/vision",
    name: "PrintNanny Vision",
    components: {
      default: () => import("../views/VideoView.vue"),
      TopNav: TopNav,
    },
  },
];

const AllRoutes = [
  {
    path: "/login",
    name: "login",
    components: {
      default: () => import("../views/LoginView.vue"),
    },
  },
  {
    path: "/settings",
    name: "Settings",
    components: {
      default: () => import("../views/SettingsView.vue"),
      TopNav: TopNav,
    },
  },
].concat(TopBarRoutes);

export { AllRoutes, TopBarRoutes };
