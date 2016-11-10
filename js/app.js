var app = angular.module('starter', []);

app.controller('MainCtrl', function ($scope, $http) {
  // where all data driven data is stored:
  $scope.metadata = {};
  // generator state
  $scope.dependencies = [];

  // get the components from the server
  $http.get('components.json').then(function (res) {
    if (res.status != 200) {
      ga('send', 'exception', {
        'exDescription': res.statusText,
        'exFatal': true
      });
      alert('Cannot download list of components!');
      return;
    }
    $scope.components = res.data;

    // get the buildtools from the server
    $http.get('presets.json').then(function (res) {
      if (res.status != 200) {
        ga('send', 'exception', {
          'exDescription': res.statusText,
          'exFatal': false
        });
        return;
      }

      $scope.metadata.presets = res.data;

      // get the buildtools from the server
      $http.get('buildtools.json').then(function (res) {
        if (res.status != 200) {
          ga('send', 'exception', {
            'exDescription': res.statusText,
            'exFatal': true
          });
          alert('Cannot download list of build tools!');
          return;
        }

        $scope.metadata.buildtools = res.data;
        // reset
        $scope.reset(0);
      });
    });
  });

  $scope.reset = function (id) {
    // reset
    $scope.buildtool = this.metadata.buildtools[id];
    $scope.language = ($scope.buildtool.languages || [])[0];
    // reset dependencies
    while (this.dependencies.length) {
      this.components.push(this.dependencies[0]);
      this.dependencies.splice(0, 1);
    }
    // reset preset
    $scope.preset = null;

    // add the defaults
    for (var i = 0; i < this.components.length; i++) {
      var ref = this.components[i];
      if ($scope.buildtool.defaults.indexOf(ref.groupId + ':' + ref.artifactId) != -1) {
        this.dependencies.push(ref);
        this.components.splice(i, 1);
        i--;
      }
    }
  };

  $scope.changeLanguage = function () {
    $scope.language = this.language;
    // add the defaults
    for (var i = 0; i < this.components.length; i++) {
      var ref = this.components[i];
      if (ref.groupId == 'io.vertx' && ref.artifactId == ('vertx-lang-' + this.language.id)) {
        this.dependencies.push(ref);
        this.components.splice(i, 1);
        i--;
      }
    }
    // reset the preset
    $scope.preset = null;
  };

  $scope.filterPreset = function () {
    return function (item) {
      return $scope.buildtool && $scope.language && item.buildtool == $scope.buildtool.id && item.language == $scope.language.id;
    };
  };

  $scope.changePreset = function () {
    $scope.preset = this.preset;
    // add the defaults
    for (var i = 0; i < this.components.length; i++) {
      var ref = this.components[i];
      if (this.preset.dependencies.indexOf(ref.groupId + ':' + ref.artifactId) != -1) {
        this.dependencies.push(ref);
        this.components.splice(i, 1);
        i--;
      }
    }
  };

  $scope.compile = function (file, exec, fqcn, zip) {
    var fn;
    // locate handlebars template
    fn = Handlebars.templates[file];
    // first path element is always ignored
    file = file.substr(file.indexOf('/') + 1);
    // need to process the fqcn
    if (fqcn) {
      var dot = file.indexOf('.');
      var lslash = file.lastIndexOf('/');
      $scope.packageName = $scope.groupId + '.' + ($scope.artifactId || $scope.name);
      $scope.className = file.substring(lslash + 1, dot);
      file = file.substr(0, Math.max(0, Math.min(dot, lslash + 1))) + $scope.packageName.replace(/\./g, '/') + '/' + $scope.className + file.substr(dot);
    }
    // add to zip
    if (exec) {
      zip.file(file, fn($scope), {
        unixPermissions: '755'
      });
    } else {
      zip.file(file, fn($scope));
    }
  };

  $scope.download = function (zip) {
    if (JSZip.support.blob) {
      zip.generateAsync({ type: 'blob', platform: 'UNIX' }).then(function (blob) {
        try {
          saveAs(blob, $scope.name + '.zip');
        } catch (e) {
          ga('send', 'exception', {
            'exDescription': e.message,
            'exFatal': true
          });

          // try fallback
          var a = document.getElementById('downloadLink');
          a.href = (window.webkitURL || window.URL).createObjectURL(blob);
          a.click();
          // clean up (needs to wait a bit)
          setTimeout(function () {
            (window.webkitURL || window.URL).revokeObjectURL(a.href);
          }, 1500);

        }
      }, function (err) {
        ga('send', 'exception', {
          'exDescription': err.message,
          'exFatal': true
        });
        alert(err);
      });
    } else {
      // blob is not supported on this browser fall back to data uri...
      zip.generateAsync({ type: 'base64', platform: 'UNIX' }).then(function (base64) {
        window.location = 'data:application/zip;base64,' + base64;
      }, function (err) {
        ga('send', 'exception', {
          'exDescription': err.message,
          'exFatal': true
        });
        alert(err);
      });
    }
  };

  $scope.generate = function () {
    var i, dep;

    // merge executables from buildtool and preset
    var executables = this.buildtool.executables || [];
    if (this.preset) {
      executables = executables.concat(this.preset.executables || []);
    }

    // track what project type is being generated
    ga('send', {
      hitType: 'event',
      eventCategory: $scope.buildtool.id + ':project',
      eventAction: $scope.buildtool.id + '/new',
      eventLabel: 'project'
    });

    for (i = 0; i < this.dependencies.length; i++) {
      dep = this.dependencies[i];
      // add stack meta-data
      dep.included = true;
      // track what dependencies are being selected
      ga('send', {
        hitType: 'event',
        eventCategory: $scope.buildtool.id + ':dependency',
        eventAction: $scope.buildtool.id + '/' + dep.groupId + ':' + dep.artifactId + ':' + dep.version,
        eventLabel: 'dependency'
      });
    }

    for (i = 0; i < this.components.length; i++) {
      dep = this.components[i];
      // add stack meta-data
      dep.included = false;
    }

    // put all into a single array
    $scope.stack = this.dependencies.concat(this.components);

    // get all data from the form
    for (i = 0; i < this.buildtool.fields.length; i++) {
      var field = this.buildtool.fields[i];
      $scope[field.key] = document.getElementById(field.key).value;
    }

    // create a new zip file
    var zip = new JSZip();

    var templates = [].concat(this.buildtool.templates);

    var main, fqcn;

    if (this.preset) {
      templates = templates.concat(this.preset.templates);
      // use the preset main template for the language
      this.compile(this.preset.main, false, this.preset.fqcn, zip);
      main = this.preset.main;
      fqcn = this.preset.fqcn;
    } else {
      if (this.language) {
        // use the default main template for the language
        this.compile(this.language.main, false, this.language.fqcn, zip);
        main = this.language.main;
        fqcn = this.language.fqcn;
      }
    }

    // derive main verticle
    if (fqcn) {
      $scope.main = $scope.packageName + '.' + $scope.className;
    } else {
      if (main) {
        var lslash = main.lastIndexOf('/');
        $scope.main = main.substr(lslash + 1);
      }
    }

    // build tool specific templates
    for (i = 0; i < templates.length; i++) {
      this.compile(templates[i], (executables || []).indexOf(templates[i]) != -1, false, zip);
    }

    // blobs
    var blob = this.buildtool.blob;
    if (this.preset) {
      blob = this.preset.blob || blob;
    }

    if (blob) {
      // get the buildtools from the server
      JSZipUtils.getBinaryContent(blob, function (err, data) {
        if (err) {
          ga('send', 'exception', {
            'exDescription': err,
            'exFatal': true
          });
          console.log(err);
          return;
        }

        zip.loadAsync(data)
          .then(function (val) {
            $scope.download(val);
          })
          .catch(function (ex) {
            ga('send', 'exception', {
              'exDescription': ex.message,
              'exFatal': true
            });
            alert(ex.message);
          });
      });
    } else {
      $scope.download(zip);
    }
  };
});
