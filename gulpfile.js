var gulp = require('gulp')
  , clean = require('gulp-clean')
  , ngmin = require('gulp-ng-annotate')
  , uglify = require('gulp-uglify')
  , replace = require('gulp-replace')
  , concat = require('gulp-concat');

/**
 * Clean the build directory
 */
gulp.task('clean', function(next){
	return gulp.src('build', { read: false })
		.pipe(clean());
});

/**
 * Minify javascript files for dev
 */
gulp.task('js-dev', [ 'clean' ], function(){
	return gulp.src([ 'src/**/*.js' ])
		.pipe(concat('tablelist-dev.js'))
		.pipe(ngmin())
		.pipe(gulp.dest('build'));
});

/**
 * Minify javascript files for prod
 */
gulp.task('js-prod', [ 'clean' ], function(){
	return gulp.src([ 'src/**/*.js' ])
		.pipe(concat('tablelist.js'))
		.pipe(replace('-dev', '', { skipBinary: true }))
		.pipe(replace('_DEV', '_PROD', { skipBinary: true }))
		.pipe(replace('development', 'production', { skipBinary: true }))
		.pipe(ngmin())
		.pipe(uglify())
		.pipe(gulp.dest('build'));
});

/**
 * Run all steps in order
 */
gulp.task('default', [ 'clean', 'js-dev', 'js-prod' ]);
