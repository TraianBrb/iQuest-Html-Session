const gulp         = require('gulp');
const browserSync  = require('browser-sync').create();
const sass         = require('gulp-sass');
const runSequence  = require('run-sequence');
const del          = require('del');
const pug          = require('gulp-pug');
const autoprefixer = require('gulp-autoprefixer');


// Static Server + watching scss/html files
gulp.task('serve', ['build'], function() {

    browserSync.init({
        server: "./build"
    });

    gulp.watch("source/scss/*.scss", ['sass']);
    gulp.watch("source/images/*", ['copy:images']);
    gulp.watch("source/views/*.pug", ['views']).on('change', browserSync.reload);
});

// Set the order in which the tasks will run
gulp.task('build', function(cb) {
  runSequence('build-clean',
              ['sass', 'views', 'copy:images'],
              cb);
});

// Compile sass into CSS & auto-inject into browserSync
gulp.task('sass', function() {
  return gulp.src('source/scss/main.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream());
});

// Pipe pug
gulp.task('views', function buildHTML() {
  return gulp.src('source/views/*.pug')
  .pipe(pug())
  .pipe(gulp.dest('build'));
});

// copy images from source to build
gulp.task('copy:images', function() {
  return gulp.src('source/images/*')
    .pipe(gulp.dest('build/images'))
});

// Clean the build folder
gulp.task('build-clean', function() {
  return del('build');
});

gulp.task('default', ['serve']);
