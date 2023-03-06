import vue from "@vitejs/plugin-vue"
import { resolve } from "path"
import mix from "vite-plugin-mix"
import { defineConfig } from "vitest/config"

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: { "@": resolve(__dirname, "src") },
  },
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
  test: {
    includeSource: ["src/**/*.ts"],
    coverage: { reporter: ["text", "html"] },
  },
})
