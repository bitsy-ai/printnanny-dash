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
        name: "printnanny-settings",
        components: {
          SettingsPanel: () => import("@/components/settings/PrintNannyAccountPanel.vue")
        }
      }
    ]
  },
]

const AllRoutes = [
  {
    path: "/login",
    name: "login",
    components: {
      default: () => import("@/views/LoginView.vue"),
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
].concat(TopBarRoutes).concat(SettingsRoutes) as RouteRecordRaw[];



export { AllRoutes, TopBarRoutes, SettingsRoutes };
