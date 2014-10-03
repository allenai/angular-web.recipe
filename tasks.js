var gulp = require('gulp');
var plumber = require('gulp-plumber');
var cb = require('gulp-cache-breaker');
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var rimraf = require('gulp-rimraf');
var gutil = require('gulp-util');

var util = require('util');
var futil = require('flapjack-util');

var paths = new futil.Paths(__dirname, require('./paths'));

/**
 * Removes all build artifacts.
 */
gulp.task('clean', function() {
  gutil.log(util.format('Removing artifacts from %s',
      gutil.colors.magenta(paths.build)));
  return gulp.src(paths.build + '/**/*', { read: false })
      .pipe(rimraf());
});

/**
 * Copies all html files to the build directory.
 */
gulp.task('html', [ 'clean', 'js', 'less', 'assets' ], function() {
  gutil.log(util.format('Copying %s to %s',
      gutil.colors.magenta(paths.html), gutil.colors.magenta(paths.build)));
  return gulp.src(paths.html)
      .pipe(cb())
      .pipe(gulp.dest(paths.build));
});


/**
 * Compiles LESS files.
 */
gulp.task('less', [ 'clean' ], function() {
  gutil.log(util.format('Compiling %s to %s',
      gutil.colors.magenta(paths.less), gutil.colors.magenta(paths.build)));
  return gulp.src(paths.less)
    .pipe(plumber(function(err) {
      // If the biscuit dev server is executing the build, output an error in
      // a format that biscuit can parse and understand (JSON)
      if(gutil.env.baking) {
        console.error(
          new futil.GulpTaskError(
              'less',
              err.message,
              err.filename,
              err.lineNumber,
              err.extract.join('\n')
            ).report()
        );
      } else {
        gutil.log(err.toString());
      }
    }))
    .pipe(less({ compress: true }))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest(paths.build));
});

/**
 * Compiles Javascript.
 */
gulp.task('js', [ 'clean' ], function() {
  gutil.log(util.format('Compiling %s to %s',
      gutil.colors.magenta(paths.js), gutil.colors.magenta(paths.build)));
  return gulp.src(paths.js)
    .pipe(plumber(function(err) {
      // If the biscuit dev server is executing the build, output an error in
      // a format that biscuit can parse and understand (JSON)
      if(gutil.env.baking) {
        console.error(
          new futil.GulpTaskError(
              'js',
              err.message,
              err.filename,
              err.lineNumber,
              err.stack
            ).report()
        );
      } else {
        gutil.log(err.toString());
      }
    }))
    .pipe(browserify())
    .pipe(uglify())
    .pipe(gulp.dest(paths.build));
});

/**
 * Copies static assets.
 */
gulp.task('assets', [ 'clean' ], function() {
  gutil.log(util.format('Copying %s to %s',
      gutil.colors.magenta(paths.assets), gutil.colors.magenta(paths.build)));
  return gulp.src(paths.assets, { base: paths.src })
      .pipe(gulp.dest(paths.build));
});
