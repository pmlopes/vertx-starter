var app = angular.module('starter', []);

app.controller('MainCtrl', function ($scope, $http) {

  // where all data driven data is stored:
  $scope.metadata = {};

  // this will hold all selected dependencies
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
      // extract keys in order to make iteration a simple step
      $scope.presets = Object.keys($scope.metadata.presets || {});
      // reset
      $scope.preset = 'empty';

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
        // extract keys in order to make iteration a simple step
        $scope.buildtools = Object.keys($scope.metadata.buildtools || {});
        // reset
        $scope.reset($scope.buildtools[0]);
      });
    });
  });

  $scope.reset = function (id) {
    // reset
    $scope.buildtool = id;
    // regenerate language list
    this.languages = Object.keys(this.metadata.buildtools[id].languages || {});
    this.language = this.languages[0];
    // reset dependencies
    while (this.dependencies.length) {
      this.components.push(this.dependencies[0]);
      this.dependencies.splice(0, 1)
    }
    // reset preset
    this.preset = 'empty';
    // add the defaults
    for (var i = 0; i < this.components.length; i++) {
      var ref = this.components[i];
      if (this.metadata.buildtools[id].defaults.indexOf(ref.groupId + ':' + ref.artifactId) != -1) {
        this.dependencies.push(ref);
        this.components.splice(i, 1);
        i--;
      }
    }
  }

  $scope.changeLanguage = function () {
    $scope.language = this.language;
    // add the defaults
    for (var i = 0; i < this.components.length; i++) {
      var ref = this.components[i];
      if (ref.groupId == 'io.vertx' && ref.artifactId == ('vertx-lang-' + this.language)) {
        this.dependencies.push(ref);
        this.components.splice(i, 1);
        i--;
      }
    }
    // reset the preset
    $scope.preset = 'empty';
  };

  $scope.filterPreset = function () {
    return function (item) {
      var p = $scope.metadata.presets[item];
      if (p) {
        return p.buildtool == $scope.buildtool && p.language == $scope.language;
      }

      return false;
    };
  };

  $scope.changePreset = function () {
    $scope.preset = this.preset;

    var p = this.metadata.presets[this.preset];
    if (p) {
      // add the defaults
      for (var i = 0; i < this.components.length; i++) {
        var ref = this.components[i];
        if (p.dependencies.indexOf(ref.groupId + ':' + ref.artifactId) != -1) {
          this.dependencies.push(ref);
          this.components.splice(i, 1)
          i--;
        }
      }
    }
  };

  $scope.generateFile = function (file, fqcn, zip) {
    var fn, slash;
    // locate handlebars template
    fn = Handlebars.templates[file];
    // first path element is always ignored
    slash = file.indexOf('/');
    if (slash > 0) {
      file = file.substr(slash + 1);
    }
    // need to process the fqcn
    if (fqcn) {
      var dot = file.indexOf('.');
      var lslash = file.lastIndexOf('/');
      file = file.substr(0, Math.max(0, Math.min(dot, lslash + 1))) + this.main.replace(/\./g, '/') + file.substr(dot);
      $scope.packageName = this.main.substr(0, this.main.lastIndexOf('.'));
      $scope.className = this.main.substr(this.main.lastIndexOf('.') + 1);
    }
    // add to zip
    zip.file(file, fn($scope));
  };

  $scope.generate = function () {
    var i;
    // track what project type is being generated
    ga('send', {
      hitType: 'event',
      eventCategory: $scope.buildtool + ':project',
      eventAction: 'project'
    });

    for (i = 0; i < this.dependencies.length; i++) {
      var dep = this.dependencies[i];
      // add stack meta-data
      dep.included = true;
      // track what dependencies are being selected
      ga('send', {
        hitType: 'event',
        eventCategory: $scope.tool + ':dependency',
        eventAction: dep.groupId + ':' + dep.artifactId + ':' + dep.version
      });
    }

    for (i = 0; i < this.components.length; i++) {
      var dep = this.components[i];
      // add stack meta-data
      dep.included = false;
    }

    // put all into a single array
    $scope.stack = this.dependencies.concat(this.components);
    $scope.language = this.language;

    // get all data from the form
    for (i = 0; i < this.metadata.buildtools[this.buildtool].fields.length; i++) {
      var field = this.metadata.buildtools[this.buildtool].fields[i];
      $scope[field.key] = document.getElementById(field.key).value;
    }

    // create a new zip file
    var zip = new JSZip();

    var p = this.metadata.presets[this.preset];
    var templates = [].concat(this.metadata.buildtools[this.buildtool].templates);

    if (p) {
      templates = templates.concat(p.templates);
      // use the preset main template for the language
      this.generateFile(p.main, p.fqcn, zip);
    } else {
      // use the default main template for the language
      var lang = this.metadata.buildtools[this.buildtool].languages[this.language];
      this.generateFile(lang.main, lang.fqcn, zip);
    }

    // build tool specific templates
    for (var i = 0; i < templates.length; i++) {
      this.generateFile(templates[i], false, zip);
    }

    if (JSZip.support.blob) {
      zip.generateAsync({ type: 'blob' }).then(function (blob) {
        saveAs(blob, $scope.name + '.zip');
      }, function (err) {
        ga('send', 'exception', {
          'exDescription': err.message,
          'exFatal': true
        });
        alert(err);
      });
    } else {
      // blob is not supported on this browser fall back to data uri...
      zip.generateAsync({ type: "base64" }).then(function (base64) {
        window.location = "data:application/zip;base64," + base64;
      }, function (err) {
        ga('send', 'exception', {
          'exDescription': err.message,
          'exFatal': true
        });
        alert(err);
      });
    }
  };
});
