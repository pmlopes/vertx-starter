function loadJSON(file, callback) {
  if (localStorage) {
    var json = localStorage.getItem(file);

    if (json) {
      json = JSON.parse(json);
      if (json.version !== window.starterVersion) {
        localStorage.removeItem(file);
      } else if (json.ttl && json.ttl < Date.now()) {
        localStorage.removeItem(file);
      } else {
        callback(null, json.text);
        return;
      }
    }
  }

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', file, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4) {
      if (xobj.status != "200" && xobj.status != "304") {
        return callback("Failed to load the metadata!");
      }
      var json = {
        version: window.starterVersion,
        // only cache for 30min
        ttl: 1800000 + Date.now(),
        text: xobj.responseText
      };

      if (localStorage) {
        localStorage.setItem(file, JSON.stringify(json));
      }

      callback(null, json.text);
    }
  };
  xobj.send(null);
}

function compileProject(project, callback) {
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

  // track what dependencies are being selected
  project.dependencies.forEach(function (el) {
    // force boolean
    el.checked = !!el.checked;

    if (el.checked) {
      ga('send', {
        hitType: 'event',
        eventCategory: project.buildtool.id + ':dependency',
        eventAction: project.buildtool.id + '/' + el.groupId + ':' + el.artifactId + ':' + el.version,
        eventLabel: 'dependency'
      });
    }
  });

  // filter checked dependencies
  project.selectedDependencies = project.dependencies.filter(function (el) {
    return el.checked;
  });

  project.transformedSelectedDependencies = project.selectedDependencies.map(function (el) {
    if (el.groupId == 'io.vertx' || el.groupId == 'junit') {
      var clone = JSON.parse(JSON.stringify(el));
      delete clone['version'];
      return clone;
    }
    return el;
  });

  project.coreVersion = project.dependencies.filter(function (el) {
    return el.groupId == 'io.vertx' && el.artifactId == 'vertx-core';
  }).map(function (el) {
    return el.version;
  });

  project.hasUnit = project.selectedDependencies.filter(function (el) {
    return el.groupId == 'io.vertx' && el.artifactId == 'vertx-unit';
  }).length > 0;

  project.metadata = {};

  // make a boolean value for the languageId
  project.metadata[project.language.id] = true;
  project.metadata.artifactSuffix = project.buildtool['non-core-suffix'] || '';

  // convert the fields to a form structure
  project.buildtool.fields.forEach(function (el) {
    project.metadata[el.key] = el.value ? el.value : el.prefill;
  });

  if (project.metadata.groupId) {
    project.metadata.packageName = project.metadata.groupId + '.' + (project.metadata.artifactId || project.metadata.name.replace(/[ -]/g, '_'))
  }

  // create a new zip file
  var zip = new JSZip();

  var templates = [];

  // marge all templates to be processed
  templates = templates.concat(project.buildtool.templates);

  if (project.language.templates) {
    templates = templates.concat(project.language.templates);
  }
  if (project.preset) {
    templates = templates.concat(project.preset.templates || []);
  }

  // build tool specific templates
  for (i = 0; i < templates.length; i++) {
    compile(project, templates[i], (executables || []).indexOf(templates[i]) != -1, zip);
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

      zip.loadAsync(data)
        .then(function (val) {
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
}

function compile(project, file, exec, zip) {
  var hbfile, zfile, fn;

  // extract filename
  var dot = file.indexOf('.');
  var lslash = file.lastIndexOf('/');

  // extra metdata
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
    zip.file(zfile, fn(project), {
      unixPermissions: '755'
    });
  } else {
    zip.file(zfile, fn(project));
  }
}
