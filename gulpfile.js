const gulp = require('gulp');
const ts = require('gulp-typescript');
const merge = require('merge2');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const runSequence = require('run-sequence');

const tsProject = ts.createProject('tsconfig.json', {removeComments: false});

gulp.task('clean', () => {
	return del('dist');
});

gulp.task('_publish', () => {
	const stream = gulp.src('src/**/*.ts')
		.pipe(sourcemaps.init())
		.pipe(tsProject());
	
	return merge([
		stream.js
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('dist')),
		stream.dts.pipe(gulp.dest('dist'))
	]);
});

gulp.task('publish', callback => {
	runSequence('clean', '_publish', callback);
});

gulp.task('dev', () => {
	runSequence('clean', '_publish', () => {
		console.log('Watching ts files');
		gulp.watch('src/**/*.ts', ['_publish']);
	});
});