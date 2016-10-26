var app = angular.module('starter', []);

app.controller('MainCtrl', function ($scope) {

  $scope.components = [
    {
      "name": "vertx-core",
      "groupId": "io.vertx",
      "artifactId": "vertx-core",
      "version": "3.3.3",
      "stack": true,
      "description": "Core"
    },
    {
      "name": "yoke",
      "groupId": "com.jetdrone",
      "artifactId": "yoke",
      "version": "3.3.3",
      "stack": false,
      "description": "Web Framework"
    }
  ];

  $scope.selectMaven = function () {
    $scope.selected = { maven: 'background: rgb(202, 60, 60)' };
    $scope.fields = [
      { key: 'name', value: 'Project Name' },
      { key: 'description', value: 'Project Description' },
      { key: 'groupId', value: 'Maven Group Id' },
      { key: 'artifactId', value: 'Maven Artifact Id' },
      { key: 'version', value: 'Project Version' },
      { key: 'main', value: 'Main Verticle' }
    ]
    $scope.title = 'Maven pom.xml'
    $scope.template = 'pom.xml'
  }

  $scope.selectGradle = function () {
    $scope.selected = { gradle: 'background: rgb(202, 60, 60)' };
    $scope.fields = [
      { key: 'name', value: 'Project Name' },
      { key: 'description', value: 'Project Description' },
      { key: 'version', value: 'Project Version' },
      { key: 'main', value: 'Main Verticle' }
    ]
    $scope.title = 'Gradle build.gradle'
    $scope.template = 'build.gradle'
  }

  $scope.selectNPM = function () {
    $scope.selected = { npm: 'background: rgb(202, 60, 60)' };
    $scope.fields = [
      { key: 'name', value: 'Project Name' },
      { key: 'description', value: 'Project Description' },
      { key: 'version', value: 'Project Version' },
    ]
    $scope.title = 'NPM package.json'
    $scope.template = 'package.json'
  }

  $scope.dependencies = []


  $scope.generate = function () {
    var template = Handlebars.templates[$scope.template];
    for (var i = 0; i < $scope.fields.length; i++) {
      $scope[$scope.fields[i].key] = document.getElementById($scope.fields[i].key).value;
    }

    var zip = new JSZip();

    zip.file($scope.template, template($scope));

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
