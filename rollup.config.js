import package_json from "./package.json" assert { type: "json" }

import resolve from "@rollup/plugin-node-resolve"
import svelte from "rollup-plugin-svelte"
import terser from "@rollup/plugin-terser"

const banner = `
/**
 * rest-scaffold.js version ${package_json.version}
 * MIT License, Copyright (c) 2023 Gregory N. Schmit
 */
`
const output = { name: "RESTScaffold", banner: banner.trim() }

export default {
  input: "src/main.js",
  output: [
    {
      ...output,
      file: "dist/rest-scaffold.js",
      format: "es",
    },
    {
      ...output,
      file: "dist/rest-scaffold.min.js",
      format: "es",
      plugins: [terser()],
    },
    {
      ...output,
      file: "dist/rest-scaffold.iife.js",
      format: "iife",
    },
    {
      ...output,
      file: "dist/rest-scaffold.iife.min.js",
      format: "iife",
      plugins: [terser()],
    },
  ],
  plugins: [
    svelte({
      // include: 'src/components/**/*.svelte',
      emitCss: false,
      compilerOptions: {
        cssHash: ({ hash, css }) => `rest-scaffold-${hash(css)}`,
      },
    }),
    resolve({
      browser: true,
      exportConditions: ["svelte"],
      extensions: [".svelte"],
    }),
  ],
}
