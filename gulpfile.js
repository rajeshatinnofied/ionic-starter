var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var browserify = require('gulp-browserify');
var gulpIf = require('gulp-if');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var cssmin = require('gulp-minify-css');
var ngAnnotate = require('gulp-ng-annotate');
var stringify = require('stringify');
var uglify = require('gulp-uglify');


var paths = {
  env: process.env.NODE_ENV || 'development',
  outputClientDir: process.env.OUTPUT_DIR || 'www/',
  sass: ['./app/scss/**/*.scss'],
  lib: [
        'app/lib/ionic/js/ionic.bundle.js',
        'app/lib/angular-ui-router/release/angular-ui-router.js',
        'app/lib/ionic-material/dist/ionic.material.min.js'
        ],
  js: 'app/scripts/app.js',
  libCss: [
        'app/lib/ionic/css/ionic.css',
        'app/lib/ionic-material/dist/ionic.material.min.css'
        ],
  indexSrc: 'app/index.html',
  imagesPath: 'app/images/*.*'
};

gulp.task('build', ['sass','vendorCss','js','sass','vendor','copyIndex','images']);
gulp.task('default', ['build','watch']);
gulp.task('js', function() {
    return gulp.src(paths.js, {
            read: false
        })
        .pipe(ngAnnotate())
        .pipe(browserify({
            transform: stringify({
                extensions: ['.html', '.tpl'],
                minify: true
            })
        }))
        .pipe(gulpIf(paths.env !== 'development', uglify()))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.outputClientDir + '/js'));
});
gulp.task('sass', function(done) {
  gulp.src('./app/scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});
gulp.task('vendorCss', function() {
    return gulp.src(paths.libCss)
        .pipe(cssmin())
        .pipe(concat('vendor.min.css'))
        .pipe(gulp.dest(paths.outputClientDir + '/css'));
});
gulp.task('vendor', function() {
    return gulp.src(paths.lib)
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest(paths.outputClientDir + '/js'));
});
gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js,['js']);
  gulp.watch(paths.lib, ['vendor']);
  gulp.watch(paths.libCss, ['vendorCss']);
  gulp.watch('app/scripts/modules/**/*.html', ['js']);
  gulp.watch('app/scripts/modules/**/*.js', ['js']);
  gulp.watch('app/index.html',['copyIndex']);
  gulp.watch('app/index.html',['copyIndex']);
});
gulp.task('copyIndex', function() {
    return gulp.src(paths.indexSrc)
    .pipe(gulp.dest(paths.outputClientDir));
});
gulp.task('images', function() {
    return gulp.src(paths.imagesPath)
    .pipe(gulp.dest(paths.outputClientDir+'/img'));
});
gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
