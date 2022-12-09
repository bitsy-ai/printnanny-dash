import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(({ _command, mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [vue()],
    build: {
      sourcemap: true,
      manifest: true,
    },
    server: {
      proxy: {
        "/printnanny/api/": {
          target: "http://localhost:8585",
        },
      },
    },
    envDir: ".env",
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    define: {
      "process.env": {},
      UnixTransport: {},
    },
  };
});
