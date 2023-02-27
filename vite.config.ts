import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// load all node_modules in a vendor chunk file
// see: https://rollupjs.org/configuration-options/#output-manualchunks
function manualChunks(id: string) {
  if (id.includes("node_modules")) {
    return "vendor";
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ _command, mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [vue()],
    build: {
      sourcemap: true,
      manifest: true,
      rollupOptions: {
        output: {
          manualChunks,
        },
      },
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
      preserveSymlinks: true,
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
