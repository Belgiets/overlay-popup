// Load plugins
var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),
  uglify = require('gulp-uglify'),
  gulpif = require('gulp-if'),
  rename = require('gulp-rename'),
  clean = require('gulp-clean'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  cache = require('gulp-cache'),
  livereload = require('gulp-livereload'),
  lr = require('tiny-lr'),
  server = lr(),
  gutil = require('gulp-util'),
  env = gutil.env.env || 'dev';

var gSrc = {
  scss: [
    'scss/**/*.scss'
  ],
  js: [
    'js/*.js'
  ]
};

var gDst = 'dist';

// Styles
gulp.task('styles', function () {
  return gulp.src(gSrc.scss)
    .pipe(gulpif('*.scss', sass({style: 'expanded'})))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(concat('overlay-popup.css'))
    .pipe(gulp.dest(gDst))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulpif('*.css', minifycss()))
    .pipe(livereload(server))
    .pipe(gulp.dest(gDst))
    .pipe((env === 'dev') ? notify({message: 'Styles task complete'}) : gutil.noop());
});

// Scripts
gulp.task('scripts', function () {
  return gulp.src(gSrc.js)
    .pipe(concat('overlay-popup.js'))
    .pipe(gulp.dest(gDst))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(livereload(server))
    .pipe(gulp.dest(gDst))
    .pipe((env === 'dev') ? notify({message: 'Scripts task complete'}) : gutil.noop());
});

// Clean
gulp.task('clean', function () {
  return gulp.src([gDst], {read: false})
    .pipe(clean());
});

// Default task
gulp.task('default', ['clean'], function () {
  gulp.run('styles', 'scripts');
});

// Watch
gulp.task('watch', function () {

  // Listen on port 35729
  server.listen(35729, function (err) {
    if (err) {
      return console.log(err)
    }
    ;

    // Watch .scss files
    gulp.watch(gSrc.scss, function (event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
      gulp.run('styles');
    });

    // Watch .js files
    gulp.watch(gSrc.js, function (event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
      gulp.run('scripts');
    });
  });
});