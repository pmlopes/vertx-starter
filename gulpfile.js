// Include gulp
const gulp = require('gulp');
const PluginError = require('plugin-error');

// Include Plugins
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const wrap = require('gulp-wrap');
const jsoncombine = require("gulp-jsoncombine");
const minify = require('gulp-minify-css');
const webpack = require('webpack-stream');
const through2 = require('through2');
const gutil = require('gulp-util');
const replace = require('gulp-replace');

const path = require('path');

let handlebars = require('handlebars');

gulp.task('css', function () {
  return gulp.src(['src/css/tooltip.css', 'src/css/hamburger.css', 'src/css/spinner.css', 'node_modules/wingcss/dist/wing.css'])
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(rename('bundle.min.css'))
    .pipe(minify({keepBreaks: true}))
    .pipe(gulp.dest('dist/css'));
});

// Insipired to gulp-handlebars but with some changes
function handlebarsPlugin() {
  const compilerOptions = {noEscape: true};

  return through2.obj(function (file, enc, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      this.emit('error', new PluginError("Handlebars plugin", 'Streaming not supported'));
      return callback();
    }

    const contents = file.contents.toString();
    let compiled = null;

    // binary files
    if (['favicon.ico'].indexOf(file.path.substr(file.path.lastIndexOf('/') + 1)) !== -1) {
      // binary file are stored as is
      compiled =
        "{\"compiler\":[7,\">= 4.0.0\"],\"main\":function(container,depth0,helpers,partials,data) {\n" +
        "    return " + JSON.stringify(contents) + ";\n" +
        "},\"useData\":false}\n";
    } else {
      try {
        compiled = handlebars.precompile(
          handlebars.parse(contents),
          compilerOptions
        ).toString();
      } catch (err) {
        console.log(err);
        this.emit('error', new PluginError("Handlebars plugin", err, {
          fileName: file.path
        }));
        return callback();
      }
    }

    file.contents = Buffer.from(compiled);
    file.templatePath = file.relative;
    file.path = gutil.replaceExtension(file.path, '.js');

    callback(null, file);
  });
}


// Compile handlebars templates and put in js directory
gulp.task('handlebars', function () {
  // Load templates from the templates/ folder relative to where gulp was executed
  return gulp.src(['templates/**/*', 'templates/**/.*'])
  // Compile each Handlebars template source file to a template function
    .pipe(handlebarsPlugin()) // Load out handlebars version
    // Wrap each template function in a call to Handlebars.template and export it
    .pipe(wrap('exports[\'<%= file.templatePath %>\'] = Handlebars.template(<%= contents %>)'))
    // Concatenate down to a single file
    .pipe(concat('templates.js'))
    // Add the Handlebars module in the final output
    .pipe(wrap('var Handlebars = require("handlebars/runtime");\n' +
      '<%= contents %>\n' +
      'require(\'../handlebars_helpers_loader.js\').load(Handlebars);'))
    // WRite the output into the templates folder
    .pipe(gulp.dest('src/gen'));
});

// Assemble the metadata and put in js directory
gulp.task('copy-blobs', function () {
  return gulp.src("blobs/*")
    .pipe(gulp.dest("dist/blobs"));
});

// Assemble the metadata and put in js directory
gulp.task('metadata', function () {
  return gulp.src("metadata/*.json")
    .pipe(jsoncombine("metadata.json", function (data) {
      return Buffer.from(JSON.stringify(data));
    }))
    .pipe(gulp.dest("src/gen"));
});

gulp.task('build-cli', gulp.series('handlebars', 'metadata'));

gulp.task('kill-cache', function() {
  const packageJson = require('./package.json');

  return gulp.src(['src/sw.js', 'src/index.html'])
    .pipe(replace('{{version}}', 'v' + packageJson.version))
    .pipe(gulp.dest('dist'));
});

gulp.task('webpack', function() {
  return gulp.src('src/web_entrypoint.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('build', gulp.series('css', 'handlebars', 'metadata', 'kill-cache', 'copy-blobs', 'webpack'));

// Default Task
gulp.task('default', gulp.series('build'));
