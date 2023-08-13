import package_json from "./package.json" assert { type: "json" }

import resolve from "@rollup/plugin-node-resolve"
import svelte from "rollup-plugin-svelte"
import terser from "@rollup/plugin-terser"

var banner = `
/**
 * rest-scaffold.js version ${package_json.version}
 * MIT License, Copyright (c) 2023 Gregory N. Schmit
 */
`

export default {
  input: "src/main.js",
  output: [
    {
      banner: banner.trim(),
      file: "dist/rest-scaffold.js",
      format: "iife",
    },
    {
      banner: banner.trim(),
      file: "dist/rest-scaffold.min.js",
      format: "iife",
      plugins: [terser()],
    },
  ],
  plugins: [
    svelte({
      // include: 'src/components/**/*.svelte',
      emitCss: false,
    }),
    resolve({
      browser: true,
      exportConditions: ["svelte"],
      extensions: [".svelte"],
    }),
  ],
}
