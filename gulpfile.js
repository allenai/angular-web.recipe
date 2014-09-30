var tasks = require('./tasks.js');
var gulp = require('gulp');

gulp.task('default', [ 'clean', 'less', 'js', 'assets', 'html' ]);
