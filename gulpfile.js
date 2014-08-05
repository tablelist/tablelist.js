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
 * Minify javascript files
 */
gulp.task('js', [ 'clean' ], function(){
	return gulp.src([ 'src/**/*.js' ])
		.pipe(concat('tablelist.js'))
		.pipe(ngmin())
		.pipe(uglify())
		.pipe(gulp.dest('build'));
});

/**
 * Run all steps in order
 */
gulp.task('default', [ 'clean', 'js' ]);
