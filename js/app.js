var app = angular.module('starter', []);

app.controller('MainCtrl', function ($scope, $http) {

  // this will hold all the components we allow in the simple project
  $scope.components = [];
  // this will hold all selected dependencies
  $scope.dependencies = [];
  // this will hold all presets
  $scope.presets = [];

  // get the components from the server
  $http.get('components.json')
    .then(function (res) {
      if (res.status != 200) {
        ga('send', 'exception', {
          'exDescription': res.statusText,
          'exFatal': true
        });
        alert('Cannot download list of components!');
        return;
      }
      $scope.components = res.data;
    });

  // get the buildtools from the server
  $http.get('buildtools.json')
    .then(function (res) {
      if (res.status != 200) {
        ga('send', 'exception', {
          'exDescription': res.statusText,
          'exFatal': true
        });
        alert('Cannot download list of build tools!');
        return;
      }
      $scope.buildtools = res.data;
      // initially select the first element
      $scope.selectBuildTool(0);
    });

  // get the buildtools from the server
  $http.get('presets.json')
    .then(function (res) {
      if (res.status != 200) {
        ga('send', 'exception', {
          'exDescription': res.statusText,
          'exFatal': false
        });
        return;
      }
      $scope.presets = res.data;
    });

  $scope.selectBuildTool = function (idx) {
    var i;

    $scope.selected = {};
    $scope.tool = $scope.buildtools[idx].name;
    $scope.fields = $scope.buildtools[idx].fields;
    $scope.title = $scope.buildtools[idx].metadata;
    $scope.templates = $scope.buildtools[idx].templates;
    $scope.fqcnTemplate = $scope.buildtools[idx].fqcnTemplate;

    // highlight choice
    $scope.selected[$scope.buildtools[idx].name] = 'background: rgb(202, 60, 60)';
    // reset dependencies
    while ($scope.dependencies.length) {
      $scope.components.push($scope.dependencies[0]);
      $scope.dependencies.splice(0, 1)
    }
    // add the defaults
    for (i = 0; i < $scope.components.length; i++) {
      var ref = $scope.components[i];
      if ($scope.buildtools[idx].defaults.indexOf(ref.groupId + ':' + ref.artifactId) != -1) {
        $scope.dependencies.push(ref);
        $scope.components.splice(i, 1);
        i--;
      }
    }
  };

  $scope.selectPreset = function () {
    for (var i = 0; i < $scope.presets.length; i++) {
      if ($scope.presets[i].name == $scope.preset) {
        var p = $scope.presets[i];
        // add the defaults
        for (var j = 0; j < $scope.components.length; j++) {
          var ref = $scope.components[j];
          if (p.dependencies.indexOf(ref.groupId + ':' + ref.artifactId) != -1) {
            $scope.dependencies.push(ref);
            $scope.components.splice(j, 1)
            j--;
          }
        }
        $scope.clearPresetSelection = true;
        $scope.preset = null;
        break;
      }
    }
  };

  $scope.generate = function () {
    var i;
    // track what project type is being generated
    ga('send', {
      hitType: 'event',
      eventCategory: 'project',
      eventAction: $scope.tool
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
    for (i = 0; i < $scope.fields.length; i++) {
      $scope[$scope.fields[i].key] = document.getElementById($scope.fields[i].key).value;
    }

    // create a new zip file
    var zip = new JSZip();

    // for each template run
    var file, fn, slash;

    for (var i = 0; i < $scope.templates.length; i++) {
      file = $scope.templates[i];
      fn = Handlebars.templates[file];
      slash = file.indexOf('/');
      if (slash > 0) {
        file = file.substr(slash + 1);
      }
      zip.file(file, fn($scope));
    }

    if ($scope.fqcnTemplate) {
      // generate the main verticle if supported
      fn = Handlebars.templates[$scope.fqcnTemplate];
      var dot = $scope.fqcnTemplate.indexOf('.');
      file = $scope.fqcnTemplate.substr(0, dot) + $scope.main.replace(/\./g, '/') + $scope.fqcnTemplate.substr(dot);
      slash = file.indexOf('/');
      if (slash > 0) {
        file = file.substr(slash + 1);
      }
      zip.file(file, fn({
        packageName: $scope.main.substr(0, $scope.main.lastIndexOf('.')),
        className: $scope.main.substr($scope.main.lastIndexOf('.') + 1)
      }));
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
  }
});
