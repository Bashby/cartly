const webpack = require("webpack");
const path = require('path');
const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.base.config.js');
// Generate client-side html
const HtmlWebpackPlugin = require('html-webpack-plugin');
// Define a base html template
const HtmlWebpackTemplatePlugin = require('html-webpack-template');
// Generate favicons for multiple devices
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

// Set some paths
const BASE_PATH = path.resolve(__dirname, 'app');
const IMAGE_PATH = path.resolve(BASE_PATH, 'asset', 'image');

module.exports = Merge(CommonConfig, {
	output: {
		filename: "[name].[chunkhash].js",
		chunkFilename:'[name].[chunkhash].js',
	},
	plugins: [
		// Set environment variables
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),

		// Uglify for production
		new webpack.optimize.UglifyJsPlugin(),

		// Build Index.html
		new HtmlWebpackPlugin({
			inject: false,
			template: HtmlWebpackTemplatePlugin,
			inlineManifestWebpackName: 'webpackManifest',
			title: 'Shopping Experience | Cartly Alpha',
			appMountId: "application",
			mobile: true,
			meta: [
				{
						name: 'description',
					content: 'CartlyIO Alpha Shopping Experience. Shop for groceries online, pick them up at your convenience.'
				}
			],
			minify: {
				'collapseWhitespace': true, // Set to true for PROD
				'preserveLineBreaks': true,
			},
			links: [],
			scripts: [
			],
		}),

		// Generate fav-icons for all targeted platforms
		new FaviconsWebpackPlugin({
			logo: path.resolve(IMAGE_PATH, 'logo_temp_v1.png'),
			prefix: 'favicons-[hash]/',
			title: 'app-favicon',
			persistentCache: true,
			emitStats: false,
			inject: true,
			icons: {
				android: true,
				appleIcon: true,
				appleStartup: true,
				coast: false,
				favicons: true,
				firefox: true,
				opengraph: false,
				twitter: false,
				yandex: false,
				windows: false
			}
		}),

		// Hash chunks (be less performant but more accurate in production)
		new webpack.HashedModuleIdsPlugin(),
	]
})