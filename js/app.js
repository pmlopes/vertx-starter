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

  $scope.reset = function (buildtool) {
    // reset
    $scope.buildtool = buildtool;
    // regenerate language list
    $scope.languages = Object.keys($scope.metadata.buildtools[$scope.buildtool].languages || {});
    $scope.language = $scope.languages[0];
    // reset dependencies
    while ($scope.dependencies.length) {
      $scope.components.push($scope.dependencies[0]);
      $scope.dependencies.splice(0, 1)
    }
    // reset preset
    $scope.preset = 'empty';
    // add the defaults
    for (var i = 0; i < $scope.components.length; i++) {
      var ref = $scope.components[i];
      if ($scope.metadata.buildtools[$scope.buildtool].defaults.indexOf(ref.groupId + ':' + ref.artifactId) != -1) {
        $scope.dependencies.push(ref);
        $scope.components.splice(i, 1);
        i--;
      }
    }
  }

  $scope.filterPreset = function () {
    return function (item) {
      var p = $scope.metadata.presets[item];
      if (p) {
        return p.buildtool == $scope.buildtool && p.language == $scope.language;
      }

      return false;
    };
  };

  $scope.selectPreset = function () {
    var p = $scope.metadata.presets[$scope.preset];
    if (p) {
      // add the defaults
      for (var i = 0; i < $scope.components.length; i++) {
        var ref = $scope.components[i];
        if (p.dependencies.indexOf(ref.groupId + ':' + ref.artifactId) != -1) {
          $scope.dependencies.push(ref);
          $scope.components.splice(i, 1)
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
      file = file.substr(0, Math.max(0, Math.min(dot, lslash + 1))) + $scope.main.replace(/\./g, '/') + file.substr(dot);
      $scope.packageName = $scope.main.substr(0, $scope.main.lastIndexOf('.'));
      $scope.className = $scope.main.substr($scope.main.lastIndexOf('.') + 1);
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

    for (i = 0; i < $scope.dependencies.length; i++) {
      var dep = $scope.dependencies[i];
      // add stack meta-data
      dep.included = true;
      // track what dependencies are being selected
      ga('send', {
        hitType: 'event',
        eventCategory: $scope.tool + ':dependency',
        eventAction: dep.groupId + ':' + dep.artifactId + ':' + dep.version
      });
    }

    for (i = 0; i < $scope.components.length; i++) {
      var dep = $scope.components[i];
      // add stack meta-data
      dep.included = false;
    }

    // put all into a single array
    $scope.stack = $scope.dependencies.concat($scope.components);

    // get all data from the form
    for (i = 0; i < $scope.metadata.buildtools[$scope.buildtool].fields.length; i++) {
      var field = $scope.metadata.buildtools[$scope.buildtool].fields[i];
      $scope[field.key] = document.getElementById(field.key).value;
    }

    // create a new zip file
    var zip = new JSZip();

    var p = $scope.metadata.presets[$scope.preset];
    var templates = [].concat($scope.metadata.buildtools[$scope.buildtool].templates);

    if (p) {
      templates = templates.concat(p.templates);
      // use the preset main template for the language
      $scope.generateFile(p.main, p.fqcn, zip);
    } else {
      // use the default main template for the language
      var lang = $scope.metadata.buildtools[$scope.buildtool].languages[$scope.language];
      $scope.generateFile(lang.main, lang.fqcn, zip);
    }

    // build tool specific templates
    for (var i = 0; i < templates.length; i++) {
      $scope.generateFile(templates[i], false, zip);
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
