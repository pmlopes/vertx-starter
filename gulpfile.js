// Include gulp
var gulp = require('gulp');

// Include Plugins
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var download = require('gulp-downloader');
var wrap = require('gulp-wrap');
var ghPages = require('gulp-gh-pages-gift');
var jsoncombine = require("gulp-jsoncombine");
var minify = require('gulp-minify-css');
var handlebars = require('gulp-handlebars');
var declare = require('gulp-declare');
var webpack = require('webpack-stream');

// Google Analytics Task
gulp.task('ga', function () {
  return download('https://www.google-analytics.com/analytics.js')
    .pipe(gulp.dest('dist/js'));
});

gulp.task('css', function () {
  return gulp.src(['css/tooltip.css', 'css/hamburger.css', 'css/spinner.css', 'node_modules/wingcss/dist/wing.css'])
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(rename('bundle.min.css'))
    .pipe(minify({keepBreaks: true}))
    .pipe(gulp.dest('dist/css'));
});

// Compile handlebars templates and put in js directory
gulp.task('handlebars', function () {
  // Load templates from the templates/ folder relative to where gulp was executed
  return gulp.src('templates/**/*')
    // Compile each Handlebars template source file to a template function
    .pipe(handlebars({handlebars: require('handlebars')})) // Load out handlebars version
    // Wrap each template function in a call to Handlebars.template
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    // Declare template functions as properties and sub-properties of exports
    .pipe(declare({
      root: 'exports',
      noRedeclare: true, // Avoid duplicate declarations
      processName: function(filePath) {
        // Allow nesting based on path using gulp-declare's processNameByPath()
        // You can remove this option completely if you aren't using nested folders
        // Drop the templates/ folder from the namespace path by removing it from the filePath
        return declare.processNameByPath(filePath.replace('templates/', ''));
      }
    }))
    // Concatenate down to a single file
    .pipe(concat('templates.js'))
    // Add the Handlebars module in the final output
    .pipe(wrap('var Handlebars = require("handlebars/runtime");\n <%= contents %>'))
    // WRite the output into the templates folder
    .pipe(gulp.dest('src/gen'));
});

// Assemble the metadata and put in js directory
gulp.task('metadata', function () {
  return gulp.src("metadata/*.json")
    .pipe(jsoncombine("metadata.json", function (data) {
      return new Buffer(JSON.stringify(data));
    }))
    .pipe(gulp.dest("src/gen"));
});

gulp.task('build', ['ga', 'css', 'handlebars', 'metadata'], function(){
  return gulp.src('src/web_entrypoint.js')
  .pipe(webpack( require('./webpack.config.js') ))
  .pipe(gulp.dest('dist/js'));
});

// Default Task
gulp.task('default', ['build']);

// Deploy to gh-pages
gulp.task('deploy', ['build'], function () {
  return gulp.src('dist/**/*')
    .pipe(ghPages({
      push: true
    }));
});
