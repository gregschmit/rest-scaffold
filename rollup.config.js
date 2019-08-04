import buble from 'rollup-plugin-buble';

export default {
  input: "src/main.js",
  output: {
    format: "umd",
    file: "dist/rest-scaffold.js",
    name: "restScaffold"
  },
  plugins: [buble({namedFunctionExpressions: false})]
};
