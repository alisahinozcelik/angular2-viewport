const path = require('path');
const webpack = require('webpack');
const root = require('app-root-path').path;

module.exports = {
	devtool: 'inline-source-map',
	module: {
		loaders: [{
			exclude: /node_modules/,
			loader: 'ts-loader',
			test: /\.ts$/
		}]
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	plugins: [
		new webpack.ContextReplacementPlugin(
			/angular(\\|\/)core(\\|\/)@angular/,
			path + '/src'
		)
	]
};