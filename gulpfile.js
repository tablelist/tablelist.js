var gulp = require('gulp');
var jshint = require('gulp-jshint');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var karma = require('karma').server;
var exec = require('gulp-exec');

/**
 * Clean build folder
 */
function cleanTask() {
  return gulp.src('build/*', {
      read: false
    })
    .pipe(clean());
}

/**
 * Concatenate javascript files for dev
 */
function dev() {
  return gulp.src(['src/**/*.js'])
    .pipe(concat('tablelist.js'))
    .pipe(ngAnnotate())
    .pipe(gulp.dest('build'));
}

/**
 * Minify javascript files for prod
 */
function prod() {
  return gulp.src(['src/**/*.js'])
    .pipe(concat('tablelist.min.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('build'));
}

/**
 * Js Hint
 */
gulp.task('jshint', function() {
  return gulp.src(['src/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

/**
 * Copy build files to a version release directory
 */
function prepareRelease() {
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
 * Run unit tests - this task is run by Wercker when building our app
 */
gulp.task('test', ['test-unit', 'release'], function() {});

gulp.task('test-unit', function(done) {
  karma.start({
    configFile: __dirname + '/tests/karma.conf.js',
    singleRun: true,
    files: [
      '../bower_components/angular/angular.js',
      '../bower_components/angular-mocks/angular-mocks.js',
      '../bower_components/angular-resource/angular-resource.js',
      '../bower_components/sinon/lib/sinon.js',
      '../build/tablelist.js',
      'unit/**/*.spec.js'
    ]
  }, done);
});

// gulp.task('test-int', function(done) {
//   karma.start({
//     configFile: __dirname + '/tests/karma.conf.js',
//     singleRun: true,
//     files: [
//       '../bower_components/angular/angular.js',
//       '../bower_components/angular-mocks/angular-mocks.js',
//       '../bower_components/angular-resource/angular-resource.js',
//       '../bower_components/sinon/lib/sinon.js',
//       '../build/tablelist.js',
//       'integration/**/*.js'
//     ]
//   }, done);
// });

/**
 * Register steps
 */
gulp.task('js-dev', dev);
gulp.task('js-prod', prod);
gulp.task('watch', js);
gulp.task('clean', cleanTask);
gulp.task('prepare-release', ['js-dev', 'js-prod'], prepareRelease);
gulp.task('release', ['clean', 'js-dev', 'js-prod', 'prepare-release']);
gulp.task('default', ['clean', 'js-dev', 'js-prod']);
