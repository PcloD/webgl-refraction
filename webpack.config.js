var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var webpack = require('webpack');

module.exports = {
    entry:  './web/js',
    output: {
        path:     './web/build/',
        publicPath : '/',
        filename: 'js/[name]-[hash].js',
    },
    devtool: 'source-map',
    module: {
    	loaders: [
            {
                test: /\.s?css$/,
                loader: ExtractTextPlugin.extract("style", ["css?sourceMap", "postcss?sourceMap", "sass?sourceMap"])
            },
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
				query: {
					presets: ['react', 'es2015'],
					cacheDirectory: true,
					plugins: ['transform-runtime']
			    }				
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
        new ExtractTextPlugin("css/[name]-[hash].css", {
            allChunks: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new CleanWebpackPlugin(['web/build'])
    ]
};

