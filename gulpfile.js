var gulp = require('gulp')
  , clean = require('gulp-clean')
  , ngmin = require('gulp-ng-annotate')
  , uglify = require('gulp-uglify')
  , replace = require('gulp-replace');

/**
 * Clean the build directory
 */
gulp.task('clean', function(next){
	return _init(gulp.src('build', { read: false }))
		.pipe(clean());
});

/**
 * Copy src folder to build directory
 */
gulp.task('copy', [ 'clean' ], function(next){
	return _init(gulp.src('src/**/*.*'))
		.pipe(gulp.dest('build'));
});

/**
 * Minify javascript files
 */
gulp.task('js', [ 'replace' ], function(){
	var stream = _init(gulp.src([ 'build/**/*.js', '!build/bower_components/**/*.js' ]));
	if (ENV_PROD) {
		stream.pipe(ngmin())
			  .pipe(uglify());
	}
	return stream.pipe(gulp.dest('build'));
});

/**
 * Run all steps in order
 */
gulp.task('default', [ 'clean', 'copy', 'replace', 'css', 'js' ]);

/* =========================================================================
 *
 *   Helper Functions
 *
 * ========================================================================= */

function _init(stream) {
	stream.setMaxListeners(0);
	return stream;
}

function _replace(stream) {
	_init(stream);
	for (key in config) {
		stream.pipe(replace('@@'+key, config[key], { skipBinary: true }));
	}
	return stream;
}
