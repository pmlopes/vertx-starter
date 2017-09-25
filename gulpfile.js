// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var riot = require('gulp-riot');
var download = require('gulp-downloader');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var ghPages = require('gulp-gh-pages');

// Google Analytics Task
gulp.task('ga', function () {
  return download('https://www.google-analytics.com/analytics.js')
    .pipe(gulp.dest('js'));
});

// Vendor Task
gulp.task('vendor', ['ga'], function () {
  gulp
    .src(['node_modules/riot/riot.js', 'node_modules/riot-route/dist/route.js', 'node_modules/handlebars/dist/handlebars.runtime.js', 'node_modules/jszip/dist/jszip.js', 'node_modules/jszip-utils/dist/jszip-utils.js', 'js/analytics.js'])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('js'))
    .pipe(rename('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js'));
});

// Riot Task
gulp.task('riot', function () {
  gulp.src('tags/*.tag')
    .pipe(riot({
      compact: true
    }))
    .pipe(concat('tags.js'))
    .pipe(gulp.dest('js'));
});

// Lint Task
gulp.task('lint', ['riot'], function () {
  return gulp.src(['js/app.js', 'js/tags.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Minify JS
gulp.task('minify', ['riot'], function () {
  return gulp.src(['js/app.js', 'js/tags.js'])
    .pipe(rename('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js'));
});

// Minify handlebars
gulp.task('handlebars', function () {
  return gulp.src(['templ/**/*.*', 'templ/**/.*'])
    .pipe(handlebars())
    .pipe(wrap('  Handlebars.templates[\'<%= file.relative %>\'] = Handlebars.template(<%= contents %>);\n'))
    .pipe(concat('templates.js'))
    .pipe(wrap('(function () {\n  <%= contents %>\n})();'))
    .pipe(gulp.dest('js'))
    .pipe(rename('templates.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js'));

});

// Watch Files For Changes
gulp.task('watch', function () {
  gulp.watch('js/*.js', ['lint', 'minify']);
});

// Default Task
gulp.task('default', ['vendor', 'handlebars', 'lint', 'minify', 'watch']);

// Deploy to gh-pages
gulp.task('deploy', ['vendor', 'handlebars', 'minify'], function () {
  return gulp.src(['blobs', 'css', 'img', 'js/*.min.js', '*.json', 'index.html', 'CNAME'])
    .pipe(ghPages({
      push: false
    }));
});
