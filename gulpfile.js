var gulp = require('gulp'),
  compass = require('gulp-compass'),
  autoprefixer = require('gulp-autoprefixer'),
  minify_css = require('gulp-minify-css'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  cache = require('gulp-cache'),
  plumber = require('gulp-plumber'),
  browser_sync = require('browser-sync'),
  webpack = require('webpack-stream'),
  imagemin = require('gulp-imagemin'),
  del = require('del'),
  run_sequence = require('run-sequence'),
  cp = require('child_process');

// Stylesheets
gulp.task('styles', function() {
  return gulp.src('assets/css/*.scss')
  .pipe(plumber())
  .pipe(compass({ css: 'assets/css', sass: 'assets/css', image: 'assets/img', sourcemap: 'true' }))
  .pipe(autoprefixer('> 2%', 'ie 9', 'ie 10', 'ios 5', 'ios 6', 'android 4'))
  .pipe(minify_css())
  .pipe(gulp.dest('assets/css'))
  .pipe(gulp.dest('_site/assets/css'))
  .pipe(browser_sync.reload({stream:true}));
});

// Javascipt
gulp.task('scripts', function() {
  return gulp.src('assets/js/app.js')
  .pipe(plumber())
  .pipe(webpack({
    watch: false,
    devtool: '#source-map',
    output: {
      filename: 'bundle.js'
    },
    module: {
      loaders: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
      ]
    },
    externals: {
      'angular': 'angular',
      "jquery": "jQuery"
    }
    }))
    .pipe(gulp.dest('assets/js'))
    .pipe(gulp.dest('_site/assets/js'))
    .pipe(browser_sync.reload({stream:true}));
});

// Images
gulp.task('image-min', function () {
  return gulp.src('assets/img/src/**/*.{gif,jpg,jpeg,png,svg}')
  .pipe(imagemin())
  .pipe(gulp.dest('assets/img/dist'))
  .pipe(gulp.dest('_site/assets/img/dist'));
});


// Build the Jekyll site
gulp.task('jekyll-build', function (done) {
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
  .on('close', done);
});

// Rebuild Jekyll & do page reload
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  browser_sync.reload();
});

// Wait for jekyll-build, then launch the Server
gulp.task('browser-sync', ['jekyll-build'], function() {
  browser_sync.init(null, {
    server: {
      baseDir: '_site'
    },
    host: 'localhost'
  });
});

// Just a reload, use if not using Jekyll
gulp.task('reload', function () {
  browser_sync.reload();
});

// Clean before full build
gulp.task('clean', function () {
  gulp.src('assets/js/bundle.js')
  .pipe(plumber())
  .pipe(uglify({ mangle: false })); // angular breaks without mangle=false
  return del([
    'assets/**/*.map',
  ]);
});

// Watch for changes
gulp.task('watch', function() {
  gulp.watch(['assets/css/**/*.scss'], ['styles']);  // Watch .scss files
  gulp.watch(['assets/js/**/*.js', '!_site/assets/js/**/*.js', '!assets/js/bundle.js'], ['scripts']);   // Watch .js files
  gulp.watch(['**/*.{html,md}', '!_site/**/*.{html,md}'], ['jekyll-rebuild']);
});

// Tasks
gulp.task('build', function(callback) {
  run_sequence(['styles', 'scripts', 'image-min'], 'clean', 'jekyll-build', callback)
});

gulp.task('default', function() {
  gulp.start('styles', 'scripts', 'browser-sync', 'watch');
});
