'use strict';

const gulp = require('gulp');
const serve = require('gulp-serve');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const polyfiller = require('gulp-polyfiller');

gulp.task('serve', ['build'], serve('build'));

gulp.task('build', ['copy', 'js']);

gulp.task('clean', () => {
  return gulp.src('build/*', {read: false})
    .pipe(clean());
});

gulp.task('js', ['polyfills'], () => {
  return gulp.src(['src/js/*.js', '!src/js/*.min.js'])
    .pipe(babel())
    .pipe(concat("app.js"))
    .pipe(gulp.dest('build/js'));
});

gulp.task('polyfills', () => {
  return polyfiller.bundle(['Promise', 'Fetch'])
    .pipe(gulp.dest('build/js'))
});

gulp.task('copy', () => {
  return gulp.src(['src/**/*', '!src/js/app.js'])
    .pipe(gulp.dest('build'));
});
