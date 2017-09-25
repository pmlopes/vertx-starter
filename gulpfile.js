// Include gulp
var gulp = require('gulp');

// Include Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var riot = require('gulp-riot');
var download = require('gulp-downloader');
var wrap = require('gulp-wrap');
var ghPages = require('gulp-gh-pages');
// Custom Plugin
var handlebars = function(opts) {
  'use strict';

  opts = opts || {};
  var compilerOptions = opts.compilerOptions || {};
  var handlebars = require('handlebars');
  var through2 = require('through2');
  var gutil = require('gulp-util');

  return through2.obj(function(file, enc, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-handlebars', 'Streaming not supported'));
      return callback();
    }

    var contents = file.contents.toString();
    var compiled = null;
    try {
      var ast = handlebars.parse(contents);
      // Preprocess AST before compiling
      if (opts.processAST) {
        // processAST may return new AST or change it in place
        ast = opts.processAST(ast) || ast;
      }
      compiled = handlebars.precompile(ast, compilerOptions).toString();
    }
    catch (err) {
      this.emit('error', new gutil.PluginError('gulp-handlebars', err, {
        fileName: file.path
      }));
      return callback();
    }

    file.contents = new Buffer(compiled);
    file.templatePath = file.relative;
    file.path = gutil.replaceExtension(file.path, '.js');

    // Options that take effect when used with gulp-define-module
    file.defineModuleOptions = {
      require: {
        Handlebars: 'handlebars'
      },
      context: {
        handlebars: 'Handlebars.template(<%= contents %>)'
      },
      wrapper: '<%= handlebars %>'
    };

    callback(null, file);
  });
};

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
    .pipe(gulp.dest('dist/js'))
    .pipe(rename('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

// Riot Task
gulp.task('riot', function () {
  gulp.src('tags/*.tag')
    .pipe(riot({
      compact: true
    }))
    .pipe(concat('tags.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename('tags.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

// Lint Task
gulp.task('lint', ['riot'], function () {
  return gulp.src(['js/app.js', 'dist/js/tags.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Minify JS
gulp.task('minify', ['riot'], function () {
  return gulp.src('js/app.js')
    .pipe(rename('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

// Minify handlebars
gulp.task('handlebars', function () {
  return gulp.src(['templ/**/*.*', 'templ/**/.*'])
    .pipe(handlebars())
    .pipe(wrap('  Handlebars.templates[\'<%= file.templatePath %>\'] = Handlebars.template(<%= contents %>);\n'))
    .pipe(concat('templates.js'))
    .pipe(wrap('(function () {\n  Handlebars.templates = Handlebars.templates || {};\n  <%= contents %>\n})();'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename('templates.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));

});

// Watch Files For Changes
gulp.task('watch', function () {
  gulp.watch(['js/*.js', 'tags/*.tag'], ['lint', 'minify']);
});

// Default Task
gulp.task('default', ['vendor', 'handlebars', 'lint', 'minify', 'watch']);

// Deploy to gh-pages
gulp.task('deploy', ['vendor', 'handlebars', 'minify'], function () {
  return gulp.src('dist/**/*')
    .pipe(ghPages({
      push: false
    }));
});
