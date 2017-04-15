module.exports = config => {
	config.set({
		autoWatch: true,
		browsers: ['PhantomJS', 'Chrome', 'IE', 'IE10', 'Edge'],
		basePath: './',
		files: [
			'../../node_modules/es6-shim/es6-shim.min.js',
			'karma.entry.js'
		],
		frameworks: ['jasmine'],
		logLevel: config.LOG_INFO,
		phantomJsLauncher: {
			exitOnResourceError: true
		},
		port: 9876,
		preprocessors: {
			'karma.entry.js': ['webpack', 'sourcemap']
		},
		reporters: ['dots'],
		singleRun: true,
		webpack: require('./webpack'),
		webpackServer: {
			noInfo: true
		},
		customLaunchers: {
			IE10: {
				base: 'IE',
				'x-ua-compatible': 'IE=EmulateIE10'
			}
		}
	});
};