import path from "node:path";
import graphql from "@rollup/plugin-graphql";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [graphql(), vue()],
  envPrefix: ["VITE_", "VUE_APP_"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
      },
    },
  },
});
