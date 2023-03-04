import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import mix from "vite-plugin-mix"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      ...mix({ handler: "test_api/main.ts" }),
      apply: "serve",
    },
  ],
  build: {
    rollupOptions: {
      output: {
        format: "iife",
        dir: "dist",
        entryFileNames: "rest-scaffold.js",
      },
    },
  },
})
