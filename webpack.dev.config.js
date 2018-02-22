const polyfill = require("babel-polyfill");

const webpack = require("webpack");
const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.base.config.js');
// Generate client-side html
const HtmlWebpackPlugin = require('html-webpack-plugin');
// Define a base html template
const HtmlWebpackTemplatePlugin = require('html-webpack-template');

module.exports = Merge(CommonConfig, {
	devtool: "eval-source-map",
	output: {
		filename: "[name].js",
		chunkFilename: "[name].js",
		publicPath: '/',
	},
	plugins: [
		// Set environment variables
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('development')
			}
		}),

		// Build Index.html
		new HtmlWebpackPlugin({
			inject: false,
			template: HtmlWebpackTemplatePlugin,
			inlineManifestWebpackName: 'webpackManifest',
			title: 'Shopping Experience | Bodego Alpha',
			appMountId: "application",
			mobile: true,
			meta: [
				{
					name: 'description',
					content: 'BodegoIO Alpha Shopping Experience. Shop for groceries online, pick them up at your convenience.'
				}
			],
			minify: {
				'collapseWhitespace': false, // Set to false for DEV
				'preserveLineBreaks': true,
			},
			links: [],
			scripts: [
			],
		}),

		// Hash chunks
		new webpack.NamedModulesPlugin()
	],
	devServer: {
		//historyApiFallback: true
	}
})