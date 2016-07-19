var gulp = require('gulp');


gulp.task('default', function() {
  // place code for your default task here
});

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
  return gulp.src('./sass/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
  return gulp.watch(['./sass/**/*.scss','./sass/**/*.css'], ['sass']);
});
