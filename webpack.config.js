var path = require('path')

module.exports = {
    entry: './src/web_entrypoint.js',
    output: {
        path: path.resolve(__dirname, 'dist', 'js'),
        filename: 'bundle.js'
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
            }
        ]
    }
}
