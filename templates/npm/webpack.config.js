// webpack.config.js
var path = require('path');
const VertxPlugin = require('webpack-vertx-plugin');

var backend = {

  {{#if metadata.javascript}}
  entry: path.resolve(__dirname, 'src/main/js/index.js'),
  {{/if}}
  {{#if metadata.typescript}}
  entry: path.resolve(__dirname, 'src/main/ts/index.ts'),
  {{/if}}

  output: {
    filename: 'main-server.js',
    path: path.resolve(__dirname, 'src/main/resources')
  },

  module: {
    loaders: [
      {{#if metadata.javascript}}
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' }
      {{/if}}
      {{#if metadata.typescript}}
      { test: /\.tsx?$/, exclude: /node_modules/, loader: 'ts-loader' }
      {{/if}}
    ]
  },

  plugins: [
    new VertxPlugin()
  ]
};

module.exports = [backend];
