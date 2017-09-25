const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const VertxPlugin = require('webpack-vertx-plugin');

module.exports = (env) => {
  const isDevBuild = !(env && env.prod);

  // Configuration in common to both client-side and server-side bundles
  const sharedConfig = () => ({
    stats: {modules: false},
    resolve: {extensions: ['.js', '.jsx']},
    output: {
      filename: '[name].js',
      publicPath: 'dist/' // Webpack dev middleware, if enabled, handles requests for this URL prefix
    },
    module: {
      rules: [
        {test: /\.jsx?$/, include: /src\/.+\/js/, use: 'babel-loader'},
        {test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000'}
      ]
    },
    plugins: []
  });

  // Configuration for client-side bundle suitable for running in browsers
  const clientBundleOutputDir = './src/main/resources/webroot/dist';
  const clientBundleConfig = merge(sharedConfig(), {
    entry: {'main': './src/main/js/boot-client.jsx'},
    module: {
      rules: [
        {test: /\.css$/, use: ExtractTextPlugin.extract({use: isDevBuild ? 'css-loader' : 'css-loader?minimize'})}
      ]
    },
    output: {path: path.join(__dirname, clientBundleOutputDir)},
    plugins: [
      new ExtractTextPlugin('site.css'),
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./src/main/resources/webroot/dist/vendor-manifest.json')
      })
    ].concat(isDevBuild ? [
      // Plugins that apply in development builds only
      new webpack.SourceMapDevToolPlugin({
        filename: '[file].map', // Remove this line if you prefer inline source maps
        moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
      }),
      new VertxPlugin()
    ] : [
      // Plugins that apply in production builds only
      new webpack.optimize.UglifyJsPlugin(),
      new VertxPlugin()
    ])
  });

  return [clientBundleConfig];
};
