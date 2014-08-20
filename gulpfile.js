var gulp = require('gulp')
  , ngmin = require('gulp-ng-annotate')
  , uglify = require('gulp-uglify')
  , replace = require('gulp-replace')
  , watch = require('gulp-watch')
  , concat = require('gulp-concat');

/**
 * Minify javascript files for dev
 */
function dev() {
 	return gulp.src([ 'src/**/*.js' ])
 		.pipe(concat('tablelist.js'))
 		.pipe(ngmin())
 		.pipe(gulp.dest('build'));
}


/**
 * Minify javascript files for prod
 */
function prod() {
 	return gulp.src([ 'src/**/*.js' ])
 		.pipe(concat('tablelist.min.js'))
 		.pipe(ngmin())
 		.pipe(uglify())
 		.pipe(gulp.dest('build'));
}


/**
 * Watch for changes
 */
function js() {
	watch({ 
		glob: 'src/**/*.js', 
		emit: 'one', 
		emitOnGlob: false 
	}, dev);
}

/**
 * Register steps
 */
gulp.task('js-dev', dev);
gulp.task('js-prod', prod);
gulp.task('watch', js);
gulp.task('default', [ 'js-dev', 'js-prod' ]);
