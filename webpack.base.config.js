const polyfill = require("babel-polyfill");

const webpack = require("webpack");
const path = require('path');
// Override hashing of chunks to use md5
const WebpackChunkHash = require("webpack-chunk-hash");
// Inline the webpack manifest
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
// Wipe build/dist directories on re-build, upon request
const CleanWebpackPlugin = require('clean-webpack-plugin');
// Combine disparate CSS into a single file
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// Parse environment variables
const clean = process.env.BUILD_CLEAN == "true";

// Babel transpiler options
var babelOptions = {
	'cacheDirectory': true,
	"presets": [
		[
			"env",
			{
				"targets": {
					"browsers": ["last 2 versions", "safari >= 7"]
				}
			}
		]
	]
};

// Set some paths
const BUILD_PATH = path.resolve(__dirname, 'build');
const BASE_PATH = path.resolve(__dirname, 'app');
// const SCRIPT_PATH = path.resolve(BASE_PATH, 'script');
// const STYLE_PATH = path.resolve(BASE_PATH, 'styles');
const IMAGE_PATH = path.resolve(BASE_PATH, 'asset', 'image');

// Main configuration object
module.exports = {
	context: BASE_PATH,
	entry: {
		polyfills: "babel-polyfill",
		app: path.resolve(BASE_PATH, "app.jsx")
	},
	output: {
		path: BUILD_PATH,
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					{ loader: 'style-loader' },
					{ loader: 'css-loader', options: { modules: true } }
				],
				include: /flexboxgrid/
			},
			{
				test: /\.css$/,
				include: [
					BASE_PATH,
					path.resolve(__dirname, "node_modules/normalize.css/"),
				],
				exclude: /flexboxgrid/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: "css-loader"
				})
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: ExtractTextPlugin.extract({
					use: [{
						loader: "css-loader",
						options: {
							sourceMap: true
						}
					}, {
						loader: "sass-loader",
						options: {
							sourceMap: true
						}
					}],
					// use style-loader in development
					fallback: "style-loader"
				})
			},
			{
				test: /\.json$/,
				exclude: /node_modules/,
				use: {
					loader: 'json-loader',
				}
			},
			{
				test: /\.yaml$/,
				exclude: /node_modules/,
				use: ['json-loader', 'yaml-loader'],
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: babelOptions
					}
				]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "source-map-loader"
					}
				],
				enforce: "pre"
			},
			{
				test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i, // Notes: Embed small images in CSS via data-urls
				exclude: /node_modules/,
				use: [
					{
						loader: 'url-loader',
						query: {
							limit: 10000
						}
					},
					{
						loader: 'image-webpack-loader',
						query: {
							mozjpeg: {
								progressive: true,
								quality: 65
							},
							gifsicle: {
								interlaced: false
							},
							optipng: {
								optimizationLevel: 7
							},
							pngquant: {
								quality: '65-90',
								speed: 4
							}
						}
					}
				],
			}
		]
	},
	resolve: {
		extensions: ['*', '.js', '.jsx', '.json', '.css', '.scss', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.eot', '.ttf', '.woff', '.woff2']
	},
	externals: {
		// "react": "React",
		// "react-dom": "ReactDOM",
	},
	node: {
		// console: true,
		// fs: 'empty',
		// net: 'empty',
		// tls: 'empty'
	},
	plugins: [
		// Clean up existing
		clean ? new CleanWebpackPlugin(['dist', 'build']) : function () {},

		// Break out vendor and manifest common chunks
		new webpack.optimize.CommonsChunkPlugin({
			names: ['vendor', 'manifest'],
			minChunks: Infinity
		}),

		// Extract CSS into a common file
		new ExtractTextPlugin("[name].css"),

		new InlineManifestWebpackPlugin({
			name: 'webpackManifest'
		}),

		new WebpackChunkHash(),
	]
};
