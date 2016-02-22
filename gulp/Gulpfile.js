var gulp = require('gulp');

// Include Plugins
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var gutil = require('gulp-util');
var shell = require('gulp-shell');
var browserSync = require('browser-sync').create();

// Compile Sass; note sass options to prevent server from breaking when you fudge a css rule
gulp.task('sass', function() {
    return gulp.src('scss/style.scss')
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'compressed',
            errToConsole: true
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('../assets/css/'))
        .pipe(rename('style-embed-for-crp-only.html'))
        .pipe(gulp.dest('../_includes/'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('js/modules/*.js')
        .pipe(concat('main.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest('../assets/js'), browserSync.reload);
});


//the default "compile" task for sass and js
gulp.task('dev', function() {
    gulp.watch(['scss/*.scss', 'scss/modules/*scss'], ['sass']);
    gulp.watch("scss/partials/*.scss", ['sass','build']);
    gulp.watch("js/modules/*.js", ['scripts']);
    gulp.watch("../**/*.md", ['build']);
    gulp.watch("../_site/index.html").on("change", browserSync.reload);
});

// Task for building Jekyll when something changed:
// If you use Bundler:
gulp.task('build', shell.task(['cd .. && bundle exec jekyll build --watch']));
// Otherwise use the default Jekyll command
// gulp.task('build', shell.task(['cd .. && jekyll build --watch && echo pwd']));

// Task for serving site with Browsersync
gulp.task('serve', function() {
    browserSync.init({ server: { baseDir: '../_site/' } });
});

// Default Task
gulp.task('default', ['dev', 'serve']);
