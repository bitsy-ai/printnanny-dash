export default [
  {
    path: "/",
    name: "Welcome",
    component: () => import("../views/WelcomeView.vue"),
  },
  {
    path: "/vision",
    name: "PrintNanny Vision",
    component: () => import("../views/VideoView.vue"),
  },
];
