let _ = require('lodash')
let JSZip = require('jszip')
let OpenAPILoader = require('./openapi/OpenAPILoader').loadOpenAPIAndValidate;

let resolveGenerator = require('./generators/generators.js').resolveGenerator;

let fieldsCallbacks = {
  "graalNativeImage": (project, value, templates, trackFn) => {
    if (value) {
      templates.push(...project.buildtool["graalNativeImageTemplates"]);
      trackFn(project.buildtool.id + ':feature', project.buildtool.id + '/graalNativeImage', 'feature')
      return Promise.resolve()
    }
  },
  "groupId": (project, value) => {
    _.set(project, "metadata.package", value + '.' + (project.metadata.artifactId || project.metadata.name.replace(/[ -]/g, '_')));
    project.metadata.packageDir = project.metadata.package.replace(/\./g, '/');
    return Promise.resolve();
  },
  "name": (project, value) => {
    project.metadata.name = value.replace(/[ -]/g, '_')
    return Promise.resolve()
  },
  "openapi": (project, value) => {
    return OpenAPILoader(value)
      .then(openapi => {
        project.metadata.openapi = openapi;
        return Promise.resolve();
      });
  }
}

function compileProject(project, trackFn, trackExceptionFn, loadBlob) {
  return new Promise((resolve, reject) => {

    var templates = [];
    project.metadata = {};

    // track what project type is being generated
    trackFn(project.buildtool.id + ':project', project.buildtool.id + '/new', 'project')

    //---------- Build tool related metadata

    // merge executables from buildtool and preset
    project.executables = _.concat(
      _.get(project, "buildtool.executables", []),
      _.get(project, "preset.executables", [])
    )

    // alias for selected dependencies
    project.dependenciesGAV = {};

    project.dependencies.forEach(function (el) {
      project.dependenciesGAV[el.groupId + ':' + el.artifactId] = el.version;
      if (el.classifier) {
        project.dependenciesGAV[el.groupId + ':' + el.artifactId + ':' + el.classifier] = el.version;
      }

      // track what dependencies are being selected
      trackFn(project.buildtool.id + ':dependency', project.buildtool.id + '/' + el.groupId + ':' + el.artifactId + ':' + el.version, 'dependency');
    });

    // bom generation
    if (project.buildtool.id == "stack") {
      project.bom = [];
      project.components.forEach(function (el) {
        var c = _.cloneDeep(el);
        if (project.dependencies.find((el) => (el.classifier) ? el.groupId + ':' + el.artifactId + ':' + el.classifier in project.dependenciesGAV : el.groupId + ':' + el.artifactId)) c.included = true;
        else c.included = false;
        project.bom.push(c);
      });
    }

    // Suffix for artifacts
    if (project.buildtool.id == "sbt") {
      project.metadata.artifactSuffix = project.buildtool['non-core-suffix'] || '';
    }

    if (project.buildtool.id == "npm") {
      // filtered dependencies by scope "dev", "prod", "mvn"
      project.npmDevDependencies = [];
      project.npmProdDependencies = [];
      project.npmMavenDependencies = [];

      project.dependencies.forEach(function (el) {
        if (el.npm) {
          if (el.scope === 'test') {
            project.npmDevDependencies.push(el);
          } else {
            project.npmProdDependencies.push(el);
          }
        } else {
          project.npmMavenDependencies.push(el);
        }
      })

    }

    // Make language id a boolean
    project.metadata[project.language.id] = true;

    // create a new zip file
    var zip = new JSZip();

    let generator = (project.preset) ? resolveGenerator(project.preset.id) : resolveGenerator("default");

    //---------- Solve fields (fieldCallbacks could be async)!

    // Load responses into metadata
    let promises = _.concat(
      _.get(project, "buildtool.fields", []),
      _.get(project, "preset.fields", [])
    ).map(function (el) {
      project.metadata[el.key] = el.value;
      if (fieldsCallbacks.hasOwnProperty(el.key)) return fieldsCallbacks[el.key](project, el.value, templates, trackFn, trackExceptionFn);
      else return Promise.resolve();
    });

    Promise
      .all(promises)
      .then(p => {
        // Process var templates
        _.forEach(_.merge(
          {},
          _.get(project, "buildtool.var_templates", {}),
          _.get(project, "language.var_templates", {}),
          _.get(project, "preset.var_templates", {})
        ), (var_template, var_template_name) => {
          project.metadata[var_template_name] =
            var_template.replace(/{(.*?)}/g, (match, varName) => project.metadata[varName] || '')
        });
        return generator(project, templates, zip);
      })
      .then(zip => {
        let blob = _.get(project, "preset.blob", project.buildtool.blob);
        if (blob) {
          return loadBlob(blob).then(data => {
            return zip.loadAsync(data, {
              /**
               * Abuse the decode file name to do move the blog into the project path
               */
              decodeFileName: function (path) {
                return project.metadata.name.replace(/[ -]/g, '_') + '/' + String.fromCharCode.apply(null, path);
              }
            })
          })
        } else {
          return Promise.resolve(zip)
        }
      })
      .then(zip => resolve(zip))
      .catch(ex => {
        trackExceptionFn(ex);
        reject(ex);
      })
  });
};

// Note: Node.JS doesn't support ES6 modules directives. exports works both for webpack and node
exports.compileProject = compileProject
