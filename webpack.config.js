const path = require('path');
var webpack = require("webpack");
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/web_entrypoint.js',
  output: {
    path: path.resolve(__dirname, 'dist', 'js'),
    filename: "[name].bundle.js"
  },
  mode: "production",
  devtool: 'source-map',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.tag$/,
        exclude: /node_modules/,
        use: [{
          loader: 'riot-tag-loader',
          options: {
            hot: false,
            type: 'es6'
          }
        }]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  optimization: {
    minimizer: [new TerserPlugin({
      cache: true
    })]
  }
};
