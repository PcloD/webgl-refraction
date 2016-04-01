var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = require('./webpack.config');

config.plugins = config.plugins.slice(0,1);

config.module.loaders[0] = {
    test: /\.s?css$/,
    loader: "style?sourceMap!css?sourceMap!postcss?sourceMap!sass?sourceMap"
};

module.exports = config;