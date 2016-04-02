var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var babelQuery = {
    presets: ['react', 'es2015'],
    cacheDirectory: true,
    plugins: ['transform-runtime']
};

var config = {
    entry:  './web/js',
    output: {
        path:     './web/build/',
        filename: 'js/[name]-[hash].js',
    },
    devtool: 'source-map',
    module: {
    	loaders: [
            {
                test: /\.(jpg|png|gif|ttf|otf|eot|woff|svg)$/,
                loader: 'file?name=[path][name]-[hash].[ext]&context=web'
            },
            {
                test: /\.html$/,
                loader: 'html',
                query: {
                    root: __dirname + '/web',
                    interpolate: true
                }
            },
            {
            	test: /.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel',
				query: babelQuery
            }    		
    	]
    },
    postcss: function () {
        return [autoprefixer, cssnano];
    },
	plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './web/index.html',
            inject: true
        }),
        new CleanWebpackPlugin(['web/build'])
    ]
};

module.exports = function(options) {
    options = options || 'BUILD';

    switch(options) {
        case 'BUILD':
            var ExtractTextPlugin = require("extract-text-webpack-plugin");
            var webpack = require('webpack');

            config.output.publicPath = '/';

            config.module.loaders.unshift({
                test: /\.s?css$/,
                loader: ExtractTextPlugin.extract("style", ["css?sourceMap", "postcss?sourceMap", "sass?sourceMap"])
            });
            config.plugins.unshift(new ExtractTextPlugin("css/[name]-[hash].css", {
                allChunks: true
            }));
            config.plugins.unshift(new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }));
            break;
        case 'HOT':
            config.output.publicPath = 'http://localhost:8080/';

            config.module.loaders.unshift({
                test: /\.s?css$/,
                loader: "style?sourceMap!css?sourceMap!postcss?sourceMap!sass?sourceMap"
            });

            babelQuery.presets.push('react-hmre');
            break;
    }

    return config;
}

