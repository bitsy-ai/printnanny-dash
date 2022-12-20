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
    path: "/cam",
    name: "Camera",
    components: {
      default: () => import("@/views/VideoView.vue"),
      TopNav: TopNav,
    },
  },
];

const SettingsRoutes = [
  {
    path: "/settings",
    name: "settings",
    components: {
      default: () => import("@/views/SettingsView.vue"),
      TopNav: TopNav,
    },
    children: [
      {
        path: "printnanny",
        name: "printnanny-account",
        components: {
          SettingsPanel: () =>
            import("@/components/settings/PrintNannyAccountPanel.vue"),
        },
      },
      {
        path: "camera",
        name: "camera-settings",
        components: {
          SettingsPanel: () =>
            import("@/components/settings/CameraSettingsForm.vue"),
        },
      },
      {
        path: "files/:app",
        name: "edit-settings-files",
        components: {
          SettingsPanel: () =>
            import("@/components/settings/SettingsFileEditor.vue"),
        },
        props: true,
      },
      {
        path: "device-info",
        name: "device-info",
        components: {
          SettingsPanel: () =>
            import("@/components/settings/DeviceInfoPanel.vue"),
        },
      },
    ],
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
]
  .concat(TopBarRoutes)
  .concat(SettingsRoutes) as RouteRecordRaw[];

export { AllRoutes, TopBarRoutes, SettingsRoutes };
