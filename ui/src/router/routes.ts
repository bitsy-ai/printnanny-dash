export default [
  {
    path: "/",
    name: "Home",
    navbar: true,
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/vision",
    name: "PrintNanny Vision",
    navbar: true,
    component: () => import("../views/VideoView.vue"),
  },
  {
    path: "/settings",
    name: "Settings",
    navbar: false,
    component: () => import("../views/SettingsView.vue"),
  },
];
