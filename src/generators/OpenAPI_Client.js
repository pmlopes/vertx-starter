let _ = require('lodash')

let utils = require('../utils.js')
let OpenAPIUtils = require('../openapi/OpenAPIUtils')

let generate = (project, templates, zip) => {
  // merge all templates to be processed
  templates = utils.mergeTemplates(project, templates);
  let templatesToProcess = templates.filter(t =>
    !t.includes("modelName") && !t.includes("Client") && !t.includes("MainVerticle") && !t.includes("Operations.md")
  );

  // build all templates
  for (let i = 0; i < templatesToProcess.length; i++) {
    try {
      utils.compileAndAddToZip(project, templatesToProcess[i], project.executables.indexOf(templatesToProcess[i]) !== -1, zip);
    } catch(e) {
      return Promise.reject(e)
    }
  }

  let modelTemplatePath = templates.find(t => t.includes("modelName"));
  let clientTemplatePath = templates.find(t => t.includes("Client"));
  let operationsMdTemplatePath = templates.find(t => t.includes("Operations.md"));

  project.metadata.openapi = OpenAPIUtils.buildOpenAPIBaseMetadata(project.metadata.openapi, false);

  return OpenAPIUtils
    .generateModels(project, modelTemplatePath, zip)
    .then(zip => OpenAPIUtils.generateApiClient(project, zip, clientTemplatePath, operationsMdTemplatePath))
};

exports.generate = generate;
