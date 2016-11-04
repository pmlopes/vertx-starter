var app = angular.module('starter', []);

app.controller('MainCtrl', function ($scope, $http) {

  // this will hold all the components we allow in the simple project
  $scope.components = [];
  // this will hold all selected dependencies
  $scope.dependencies = [];

  // get the components from the server
  $http.get('components.json')
    .then(function (res) {
      // TODO: handle status != 200
      $scope.components = res.data;
    });

  // get the buildtools from the server
  $http.get('buildtools.json')
    .then(function (res) {
      // TODO: handle status != 200
      $scope.buildtools = res.data;
      // initially select the first element
      $scope.selectBuildTool(0);
    });

  $scope.selectBuildTool = function (idx) {
    $scope.selected = {};
    $scope.tool = $scope.buildtools[idx].name;
    $scope.fields = $scope.buildtools[idx].fields;
    $scope.title = $scope.buildtools[idx].metadata;
    $scope.templates = $scope.buildtools[idx].templates;

    $scope.selected[$scope.buildtools[idx].name] = 'background: rgb(202, 60, 60)';
  };

  $scope.generate = function () {
    var i;
    // track what project type is being generated
    ga('send', {
      hitType: 'event',
      eventCategory: 'project',
      eventAction: $scope.tool
    });

    // track what dependencies are being selected
    for (i = 0; i < $scope.dependencies.length; i++) {
      var dep = $scope.dependencies[i];
      ga('send', {
        hitType: 'event',
        eventCategory: 'dependency',
        eventAction: dep.groupId + ':' + dep.artifactId + ':' + dep.version,
        eventLabel: $scope.tool
      });
    }

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

    if (JSZip.support.blob) {
      zip.generateAsync({ type: 'blob' }).then(function (blob) {
        console.log($scope.name + '.zip')
        console.log(saveAs);
        saveAs(blob, $scope.name + '.zip');
      }, function (err) {
        alert(err);
      });
    } else {
      // blob is not supported on this browser fall back to data uri...
      zip.generateAsync({ type: "base64" }).then(function (base64) {
        window.location = "data:application/zip;base64," + base64;
      }, function (err) {
        alert(err);
      });
    }
  }
});
