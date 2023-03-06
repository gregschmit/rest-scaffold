import { version } from "./package.json"
import buble from "rollup-plugin-buble"

var banner = `
/**
 * rest-scaffold.js version ${version}
 * MIT License, Copyright (c) 2019 Gregory N. Schmit
 */
`

export default {
  input: "src/main.js",
  output: {
    banner: banner.trim(),
    file: "dist/rest-scaffold.js",
    format: "umd",
    name: "rest-scaffold",
  },
  plugins: [buble()],
}
