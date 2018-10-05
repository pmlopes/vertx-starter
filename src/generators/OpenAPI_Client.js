let utils = require('../utils.js')
let openapiUtils = require('../openapi_utils')
let templatesFunctions = require('../gen/templates')
let _ = require('lodash')

let generate = (project, templates, zip) => {
  // merge all templates to be processed
  templates = utils.mergeTemplates(project, templates);

  // build all templates
  for (let i = 0; i < templates.length; i++) {
    try {
      utils.compileAndAddToZip(project, templates[i], project.executables.indexOf(templates[i]) !== -1, zip);
    } catch(e) {
      return Promise.reject(e)
    }
  }

  let modelTemplate = templatesFunctions["openapi/src/main/java/{packageDir}/models/{ModelName}.java"];
  _.forEach(
    openapiUtils.generateAllModels(modelTemplate, project.metadata.openapi, project.metadata.package),
    (m) => utils.addToZip(project.metadata.name + '/src/main/java/' + project.metadata.packageDir + '/models/' + m.filename, m.content, false, zip)
  );
  return Promise.resolve(zip);
};

exports.generate = generate;
