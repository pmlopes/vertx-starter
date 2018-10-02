var path = require('path')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: './src/web_entrypoint.js',
    output: {
        path: path.resolve(__dirname, 'dist', 'js'),
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tag$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'riot-tag-loader',
                    options: {
                        hot: true,
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
            },
            { 
                test: /templates\/.*$/, 
                loader: "handlebars-loader"
            }
        ]
    },
    optimization: {
        minimizer: [new UglifyJsPlugin()]
    }
}
