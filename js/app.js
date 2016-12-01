function loadJSON(file, callback) {

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', file, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

function compileProject(project, callback) {
  var i, dep;

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

  project.metadata = {};
  // convert the fields to a form structure
  project.buildtool.fields.forEach(function (el) {
    project.metadata[el.key] = el.value ? el.value : el.prefill;
  });

  // create a new zip file
  var zip = new JSZip();

  var templates = [].concat(project.buildtool.templates);

  var main, fqcn;

  if (project.preset) {
    templates = templates.concat(project.preset.templates);
    // use the preset main template for the language
    compile(project, project.preset.main, false, project.preset.fqcn, zip);
    main = project.preset.main;
    fqcn = project.preset.fqcn;
  } else {
    if (project.language) {
      // use the default main template for the language
      compile(project, project.language.main, false, project.language.fqcn, zip);
      main = project.language.main;
      fqcn = project.language.fqcn;
    }
  }

  // derive main verticle
  if (fqcn) {
    project.metadata.main = project.metadata.packageName + '.' + project.metadata.className;
  } else {
    if (main) {
      var lslash = main.lastIndexOf('/');
      project.metadata.main = main.substr(lslash + 1);
    }
  }

  // build tool specific templates
  for (i = 0; i < templates.length; i++) {
    compile(project, templates[i], (executables || []).indexOf(templates[i]) != -1, false, zip);
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

function compile(project, file, exec, fqcn, zip) {
  var fn;
  // locate handlebars template
  fn = Handlebars.templates[file];
  // first path element is always ignored
  file = file.substr(file.indexOf('/') + 1);
  // need to process the fqcn
  if (fqcn) {
    var dot = file.indexOf('.');
    var lslash = file.lastIndexOf('/');
    project.metadata.packageName = project.metadata.groupId + '.' + (project.metadata.artifactId || project.metadata.name);
    project.metadata.className = file.substring(lslash + 1, dot);
    file = file.substr(0, Math.max(0, Math.min(dot, lslash + 1))) + project.metadata.packageName.replace(/\./g, '/') + '/' + project.metadata.className + file.substr(dot);
  }
  if (exec) {
    zip.file(file, fn(project), {
      unixPermissions: '755'
    });
  } else {
    zip.file(file, fn(project));
  }
}
