let _ = require('lodash');
let templateFunctions = require('./gen/templates.js')

function compileAndAddToZip(project, templatePath, exec, zip) {

  // Write inside metadata dirName and fileName
  writeFileAndDirMetadata(project, templatePath)

  let zfile = project.metadata.name + '/' + solveZipDir(project, templatePath);

  // locate handlebars template
  let fn = _.get(templateFunctions, templatePath)
  if (!fn)
    throw new Error("Cannot find template for " + templatePath)

  // Compile with fn and add to zip
  addToZip(zfile, fn(project), exec, zip)
}

function addToZip(filePath, fileContent, exec, zip) {
  // add to zip
  if (exec) {
    zip.file(filePath, fileContent, {
      unixPermissions: '755'
    });
  } else {
    zip.file(filePath, fileContent);
  }

}

function writeFileAndDirMetadata(project, templatePath) {
    // extract filename
    var dot = templatePath.indexOf('.');
    var lslash = templatePath.lastIndexOf('/');
    project.metadata.dirName = _.get(project.metadata.packageDir || '')
    project.metadata.fileName = templatePath.substring(lslash + 1, dot);
}

function solveZipDir(project, templatePath) {
    // first path element is always ignored
    let zfile = templatePath.substr(templatePath.indexOf('/') + 1);

    // replace placeholders with variables if present
    zfile = zfile
        .replace(/{(.*?)}/g, function (match, varName) {
            return project.metadata[varName] || '';
        }).replace(/\/\//, '/');

    return zfile;
}

function filterPresets(presets) {
  return (langId, toolId) => {
    return presets.filter((el) => {
      if (el.languages) {
        var l = el.languages.filter(function (e) {
          return e.id === langId;
        });

        if (l.length === 0) {
          return false;
        }
        if (el.buildtool) {
          return el.buildtool === toolId;
        }
      } else {
        if (el.buildtool) {
          return el.buildtool === toolId;
        }
      }
      return true;
    })
  }
}

function mergeTemplates(project, alreadyCollectedTemplates) {
  let templates = alreadyCollectedTemplates;
  templates = templates.concat(project.buildtool.templates);
  // merge language specific templates
  if (project.language.templates) {
    templates = templates.concat(project.language.templates);
  }
  // merge preset templates
  if (project.preset) {
    templates = templates.concat(project.preset.templates || []);
    // merge preset language specific templates
    if (project.preset.languages) {
      var presetLanguages = project.preset.languages.filter(function (el) {
        return el.id === project.language.id;
      });

      if (presetLanguages.length === 1) {
        templates = templates.concat(presetLanguages[0].templates || []);
      }
    }
  }
  // merge dependency specific templates
  project.dependencies.forEach(function (el) {
    templates = templates.concat(el.templates || []);
    templates = templates.concat(el[project.language.id + 'Templates'] || []);
  });
  return templates
}

exports.addToZip = addToZip
exports.compileAndAddToZip = compileAndAddToZip
exports.writeFileAndDirMetadata = writeFileAndDirMetadata
exports.solveZipDir = solveZipDir
exports.filterPresets = filterPresets
exports.mergeTemplates = mergeTemplates
