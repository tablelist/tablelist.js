var gulp = require('gulp')
  , ngAnnotate = require('gulp-ng-annotate')
  , uglify = require('gulp-uglify')
  , replace = require('gulp-replace')
  , watch = require('gulp-watch')
  , concat = require('gulp-concat')
  , clean = require('gulp-clean')

/**
 * Clean build folder
 */
function cleanTask() {
	return gulp.src('build/*', {read: false})
    	.pipe(clean());
}

/**
 * Concatenate javascript files for dev
 */
function dev() {
 	return gulp.src([ 'src/**/*.js' ])
 		.pipe(concat('tablelist.js'))
 		.pipe(ngAnnotate())
 		.pipe(gulp.dest('build'));
}


/**
 * Minify javascript files for prod
 */
function prod() {
 	return gulp.src([ 'src/**/*.js' ])
 		.pipe(concat('tablelist.min.js'))
 		.pipe(ngAnnotate())
 		.pipe(uglify())
 		.pipe(gulp.dest('build'));
}

/**
 * Copy build files to a version release directory
 */
function prepareRelease () {
	var package = require('./package.json');
	return gulp.src('build/*')
    	.pipe(gulp.dest('build/' + package.version));
}

/**
 * Watch for changes
 */
function js() {
	watch('src/**/*.js', { 
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
gulp.task('clean', cleanTask);
gulp.task('prepare-release', ['js-dev', 'js-prod'], prepareRelease);
gulp.task('release', ['clean', 'js-dev', 'js-prod', 'prepare-release']);
gulp.task('default', [ 'clean', 'js-dev', 'js-prod' ]);
