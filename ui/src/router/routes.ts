export default [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/vision",
    name: "PrintNanny Vision",
    component: () => import("../views/VideoView.vue"),
  },
];
