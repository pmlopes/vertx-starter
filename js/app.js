(function (self) {
  'use strict';
  function Clone() {
  }

  self.clone = function (obj) {
    Clone.prototype = obj;
    return new Clone();
  };

  self.loadJSON = function (file, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState === XMLHttpRequest.DONE) {
        if (xobj.status !== 200 && xobj.status !== 304) {
          return callback("Failed to load the metadata!");
        }
        callback(null, xobj.responseText);
      }
    };
    xobj.send(null);
  };

  self.compileProject = function (project, callback) {
    var i;

    // merge executables from buildtool and preset
    var executables = project.buildtool.executables || [];
    if (project.preset) {
      executables = executables.concat(project.preset.executables || []);
    }

    // track what project type is being generated
    ga('send', {
      hitType: 'event',
      eventCategory: project.buildtool.id + ':project',
      eventAction: project.buildtool.id + '/new',
      eventLabel: 'project'
    });

    // alias for selected dependencies
    project.dependenciesGAV = {};

    project.dependencies.forEach(function (el) {
      project.dependenciesGAV[el.groupId + ':' + el.artifactId] = el.version;
      if (el.classifier) {
        project.dependenciesGAV[el.groupId + ':' + el.artifactId + ':' + el.classifier] = el.version;
      }

      // track what dependencies are being selected
      ga('send', {
        hitType: 'event',
        eventCategory: project.buildtool.id + ':dependency',
        eventAction: project.buildtool.id + '/' + el.groupId + ':' + el.artifactId + ':' + el.version,
        eventLabel: 'dependency'
      });
    });

    // bom generation
    project.bom = [];

    project.components.forEach(function (el) {
      var c = clone(el);
      c.included = false;
      project.bom.push(c);
    });
    // now apply the include rules from the dependencies
    project.dependencies.forEach(function (el) {
      project.bom[el.id].included = true;
    });

    // collect metadata
    project.metadata = {};

    // make a boolean value for the languageId
    var language = project.language.id;
    if (language.indexOf(' ') !== -1) {
      language = language.substring(0, language.indexOf(' '));
    }
    // the id is excluding the extras
    project.metadata[language] = true;
    project.metadata.artifactSuffix = project.buildtool['non-core-suffix'] || '';

    // convert the fields to a form structure
    project.buildtool.fields.forEach(function (el) {
      project.metadata[el.key] = el.value ? el.value : el.prefill;
    });

    if (project.metadata.groupId) {
      project.metadata.packageName = project.metadata.groupId + '.' + (project.metadata.artifactId || project.metadata.name.replace(/[ -]/g, '_'));
    }

    // complete the main
    project.metadata.main = project.language.main.replace('{package}', project.metadata.packageName || '');

    // create a new zip file
    var zip = new JSZip();

    var templates = [];

    // merge all templates to be processed
    templates = templates.concat(project.buildtool.templates);
    // merge language specific templates
    if (project.language.templates) {
      templates = templates.concat(project.language.templates);
    }
    // merge preset templates
    if (project.preset) {
      templates = templates.concat(project.preset.templates || []);
      // merge preset language specific templates
      if (project.preset.languages && project.preset.languages[project.language.id]) {
        templates = templates.concat(project.preset.languages[project.language.id].templates);
      }
    }
    // merge dependency specific templates
    project.dependencies.forEach(function (el) {
      templates = templates.concat(el.templates || []);
    });

    // build tool specific templates
    for (i = 0; i < templates.length; i++) {
      compile(project, templates[i], (executables || []).indexOf(templates[i]) !== -1, zip);
    }

    // blobs
    var blob = project.buildtool.blob;
    if (project.preset) {
      blob = project.preset.blob || blob;
    }

    if (blob) {
      // get the buildtools from the server
      JSZipUtils.getBinaryContent(blob, function (err, data) {
        if (err) {
          ga('send', 'exception', {
            'exDescription': err,
            'exFatal': true
          });
          callback(err);
          return;
        }

        zip.loadAsync(data, {
          /**
           * Abuse the decode file name to do move the blog into the project path
           */
          decodeFileName: function (path) {
            return project.metadata.name.replace(/[ -]/g, '_') + '/' + String.fromCharCode.apply(null, path);
          }
        }).then(function (val) {
          callback(null, val);
        })
          .catch(function (ex) {
            ga('send', 'exception', {
              'exDescription': ex.message,
              'exFatal': true
            });
            callback(err);
          });
      });
    } else {
      callback(null, zip);
    }
  };

  function compile(project, file, exec, zip) {
    var hbfile, zfile, fn;

    // extract filename
    var dot = file.indexOf('.');
    var lslash = file.lastIndexOf('/');

    // extra metadata
    if (project.metadata.packageName) {
      project.metadata.dirName = project.metadata.packageName.replace(/\./g, '/');
    }
    project.metadata.fileName = file.substring(lslash + 1, dot);

    // process file name (replace package placeholder with real package for zip, ignore placeholder for handlebars)
    zfile = file.replace('{package}', project.metadata.dirName || '');
    // first path element is always ignored
    zfile = zfile.substr(zfile.indexOf('/') + 1);
    hbfile = file.replace('{package}/', '');

    // locate handlebars template
    fn = Handlebars.templates[hbfile];
    // add to zip
    if (exec) {
      zip.file(project.metadata.name.replace(/[ -]/g, '_') + '/' + zfile, fn(project), {
        unixPermissions: '755'
      });
    } else {
      zip.file(project.metadata.name.replace(/[ -]/g, '_') + '/' + zfile, fn(project));
    }
  }
})(window);
