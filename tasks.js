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

var recipe = new butil.Recipe(__dirname, require('./recipe'));

/**
 * Removes all build artifacts.
 */
gulp.task('clean', function() {
  gutil.log(util.format('Removing artifacts from %s',
      gutil.colors.magenta(recipe.build)));
  return gulp.src(recipe.build + '/**/*', { read: false })
      .pipe(rimraf());
});

/**
 * Copies all html files to the build directory.
 */
gulp.task('html', [ 'clean', 'js', 'less', 'assets' ], function() {
  gutil.log(util.format('Copying %s to %s',
      gutil.colors.magenta(recipe.html), gutil.colors.magenta(recipe.build)));
  return gulp.src(recipe.html)
      .pipe(cb())
      .pipe(gulp.dest(recipe.build));
});


/**
 * Compiles LESS files.
 */
gulp.task('less', [ 'clean' ], function() {
  gutil.log(util.format('Compiling %s to %s',
      gutil.colors.magenta(recipe.less), gutil.colors.magenta(recipe.build)));
  return gulp.src(recipe.less)
    .pipe(plumber(function(err) {
      // If the biscuit dev server is executing the build, output an error in
      // a format that biscuit can parse and understand (JSON)
      if(gutil.env.baking) {
        console.error(
          new butil.GulpTaskError(
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
    .pipe(gulp.dest(recipe.build));
});

/**
 * Compiles Javascript.
 */
gulp.task('js', [ 'clean' ], function() {
  gutil.log(util.format('Compiling %s to %s',
      gutil.colors.magenta(recipe.js), gutil.colors.magenta(recipe.build)));
  return gulp.src(recipe.js)
    .pipe(plumber(function(err) {
      // If the biscuit dev server is executing the build, output an error in
      // a format that biscuit can parse and understand (JSON)
      if(gutil.env.baking) {
        console.error(
          new butil.GulpTaskError(
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
    .pipe(gulp.dest(recipe.build));
});

/**
 * Copies static assets.
 */
gulp.task('assets', [ 'clean' ], function() {
  gutil.log(util.format('Copying %s to %s',
      gutil.colors.magenta(recipe.assets), gutil.colors.magenta(recipe.build)));
  return gulp.src(recipe.assets, { base: recipe.src })
      .pipe(gulp.dest(recipe.build));
});
