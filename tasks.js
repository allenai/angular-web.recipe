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
var butil = require('biscuit-util');

var paths = require('./paths');

/**
 * Removes all build artifacts.
 */
gulp.task('clean', function() {
  gutil.log(util.format('Removing artifacts from %s',
      gutil.colors.magenta(paths.BUILD)));
  return gulp.src(paths.BUILD + '/**/*', { read: false })
      .pipe(rimraf());
});

/**
 * Copies all html files to the build directory.
 */
gulp.task('html', [ 'clean', 'js', 'less', 'assets' ], function() {
  gutil.log(util.format('Copying %s to %s',
      gutil.colors.magenta(paths.HTML), gutil.colors.magenta(paths.BUILD)));
  return gulp.src(paths.HTML)
      .pipe(cb())
      .pipe(gulp.dest(paths.BUILD));
});


/**
 * Compiles LESS files.
 */
gulp.task('less', [ 'clean' ], function() {
  gutil.log(util.format('Compiling %s to %s',
      gutil.colors.magenta(paths.LESS), gutil.colors.magenta(paths.BUILD)));
  return gulp.src(paths.LESS)
    .pipe(plumber(function(err) {
      // If the biscuit dev server is executing the build, output an error in
      // a format that biscuit can parse and understand (JSON)
      if(gutil.env.baking) {
        gutil.log(
          new butil.GulpTaskError(
              'less',
              err.message,
              err.filename,
              err.line,
              err.extract.join('\n')
            ).report()
        );
      } else {
        gutil.log(err.toString());
      }
    }))
    .pipe(less({ compress: true }))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest(paths.BUILD));
});

/**
 * Compiles Javascript.
 */
gulp.task('js', [ 'clean' ], function() {
  gutil.log(util.format('Compiling %s to %s',
      gutil.colors.magenta(paths.JS), gutil.colors.magenta(paths.BUILD)));
  return gulp.src(paths.JS)
    .pipe(plumber(function(err) {
      // If the biscuit dev server is executing the build, output an error in
      // a format that biscuit can parse and understand (JSON)
      if(gutil.env.baking) {
        gutil.log(
          new butil.GulpTaskError(
              'less',
              err.message,
              err.filename,
              err.line,
              err.extract.join('\n')
            ).report()
        );
      } else {
        gutil.log(err.toString());
      }
    }))
    .pipe(browserify())
    .pipe(uglify())
    .pipe(gulp.dest(paths.BUILD));
});

/**
 * Copies static assets.
 */
gulp.task('assets', [ 'clean' ], function() {
  gutil.log(util.format('Copying %s to %s',
      gutil.colors.magenta(paths.ASSETS), gutil.colors.magenta(paths.BUILD)));
  return gulp.src(paths.ASSETS, { base: paths.SRC })
      .pipe(gulp.dest(paths.BUILD));
});
