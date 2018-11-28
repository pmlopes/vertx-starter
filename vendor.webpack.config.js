var path = require("path");
var webpack = require("webpack");

module.exports = {
  mode: "production",
  target: 'web',
  context: __dirname,
  resolve: {
    extensions: [".js", ".jsx", ".json"],
    modules: [__dirname, "node_modules"]
  },
  entry: {
    vendor: [
      "riot",
      "swagger-parser",
      "riot-route",
      "lodash",
      "jszip",
      "jszip-utils",
      "handlebars/runtime",
      "util",
      "js-yaml",
      "typeof-article",
      "kind-of",
      "is-buffer"
    ]
  },
  output: {
    path: path.join(__dirname, "docs/js"),
    filename: "[name].dll.js",
    library: "[name]_[hash]"
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, "docs/js", "[name]-manifest.json"),
      name: "[name]_[hash]"
    })
  ]
};
