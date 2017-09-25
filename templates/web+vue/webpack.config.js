const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const bundleOutputDir = './src/main/resources/webroot/dist';
const VertxPlugin = require('webpack-vertx-plugin');

module.exports = (env) => {
  const isDevBuild = !(env && env.prod);

  return [{
    stats: {modules: false},
    context: __dirname,
    resolve: {extensions: ['.js']},
    entry: {'main': './src/main/js/boot.js'},
    module: {
      rules: [
        {test: /\.vue\.html$/, include: /src\/.+\/js/, loader: 'vue-loader'},
        {test: /\.js$/, include: /src\/.+\/js/, use: 'babel-loader'},
        {
          test: /\.css$/,
          use: isDevBuild ? ['style-loader', 'css-loader'] : ExtractTextPlugin.extract({use: 'css-loader?minimize'})
        },
        {test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000'}
      ]
    },
    output: {
      path: path.join(__dirname, bundleOutputDir),
      filename: '[name].js',
      publicPath: 'dist/'
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(isDevBuild ? 'development' : 'production')
        }
      }),
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./src/main/resources/webroot/dist/vendor-manifest.json')
      })
    ].concat(isDevBuild ? [
      // Plugins that apply in development builds only
      new webpack.SourceMapDevToolPlugin({
        filename: '[file].map', // Remove this line if you prefer inline source maps
        moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
      }),
      new VertxPlugin()
    ] : [
      // Plugins that apply in production builds only
      new webpack.optimize.UglifyJsPlugin(),
      new ExtractTextPlugin('site.css'),
      new VertxPlugin()
    ])
  }];
};
