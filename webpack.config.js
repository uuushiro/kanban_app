const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const NpmInstallPlugin = require('npm-install-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build')
};

process.env.BABEL_ENV = TARGET;

const common = {
    entry: {
        app: PATHS.app
    },
    // Add resolve.extensions.
    // '' is needed to allow imports without an extension.
    // .'s before extensions as it will fail to match without!!!
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    output: {
        path: PATHS.build,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader'],
                include: PATHS.app
            },
          // Set up jsx. this accepts js too thanks to RegExp
            {
                test: /\.jsx?$/,
                // Enable caching for improved performance during development
                // It users default OS directory by default. If you need something more custom, pass a path to it. I.e. , babel?cacheDirectory=<path>
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true
                },
                include: PATHS.app
            }
        ]
    }
};

if(TARGET == 'start' || !TARGET) {
    module.exports = merge(common, {
        devtool: 'eval-source-map',
        devServer: {
            contentBase: PATHS.build,

            // Enable history API fallbak so HTML5 History API based routing works. This is a good default that will come in handy in more complicated setups.
            historyApiFallback: true,
            hot: true,
            inline: true,
            // progress: true,

            // Display only errors to reduce the amount of output
            stats: 'errors-only',

            // Parse host and port from env so this is easy to customize.
            host: process.env.HOST,
            port: process.env.PORT
        },
        plugins: [
          new webpack.HotModuleReplacementPlugin()
          // TypeError: Cannot read property 'plugin' of nullというバグがnpm-install-webpack-pluginに存在するためfixされたら利用
          // new NpmInstallPlugin({
          //     save: true // --save
          // })
        ]
    });
}

if(TARGET == 'build') {
    module.exports = merge(common, {})
}
