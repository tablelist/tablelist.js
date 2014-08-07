var gulp = require('gulp')
  , ngmin = require('gulp-ng-annotate')
  , uglify = require('gulp-uglify')
  , replace = require('gulp-replace')
  , watch = require('gulp-watch')
  , concat = require('gulp-concat');

/**
 * Minify javascript files for dev
 */
gulp.task('js-dev', function(){
	return gulp.src([ 'src/**/*.js' ])
		.pipe(concat('tablelist-dev.js'))
		.pipe(ngmin())
		.pipe(gulp.dest('build'));
});

/**
 * Minify javascript files for prod
 */
gulp.task('js-prod', function(){
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
 * Watch for changes
 */
gulp.task('watch', function(){
	watch({ glob: 'src/**/*.js', emit: 'one', emitOnGlob: false }, function(files) {
	    gulp.run('js-dev');
	});
});

/**
 * Run all steps in order
 */
gulp.task('default', [ 'js-dev', 'js-prod' ]);
