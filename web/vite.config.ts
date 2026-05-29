import path from "node:path";
import graphql from "@rollup/plugin-graphql";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [graphql(), vue()],
  envPrefix: ["VITE_", "VUE_APP_"],
  server: {
    proxy: {
      "/api/v1": {
        target: "http://127.0.0.1:8888",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: ["import"],
      },
    },
  },
});
