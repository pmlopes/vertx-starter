let _ = require('lodash');

let utils = require('../utils.js');
let templatesFunctions = require('../gen/templates');
let OpenAPIUtils = require('../openapi/OpenAPIUtils');
let OpenAPISanitizers = require('../openapi/OpenAPISanitizers');

let generate = (project, templates, zip) => {
  // merge all templates to be processed
  templates = utils.mergeTemplates(project, templates);
  let templatesToProcess = templates.filter(t => 
    !t.includes("modelName") && 
    !t.includes("Client") &&
    !t.includes("{operationId}Handler") &&
    !t.includes("{securitySchemaId}Handler") &&
    !t.includes("{operationId}Test")
  );

  // MainVerticle needs openapi metadata
  project.metadata.openapi = OpenAPIUtils.buildOpenAPIBaseMetadata(project.metadata.openapi);

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
  let handlerTemplatePath = templates.find(t => t.includes("{operationId}Handler"));
  let securityHandlerTemplatePath = templates.find(t => t.includes("{securitySchemaId}Handler"));
  let testTemplatePath = templates.find(t => t.includes("{operationId}Test"));

  // Generate handlers
  _.each(project.metadata.openapi.operations, (operation => {
    operation.className = OpenAPISanitizers.toClassName(operation.operationId);
    utils.addToZip(
      utils.solveZipDir(project.metadata.name, {
        packageDir: project.metadata.packageDir,
        operationId: operation.className
      }, handlerTemplatePath),
      templatesFunctions[handlerTemplatePath]({
        package: project.metadata.package,
        operation: operation,
        modelsCache: project.metadata.openapi.modelsCache
      }),
      false,
      zip
    )
  }));

  // Generate security handlers
  _.each(_.get(project.metadata.openapi.original, "components.securitySchemes", {}), (securitySchema, securitySchemaName) => {
    securitySchema.className = OpenAPISanitizers.toClassName(securitySchemaName);
    utils.addToZip(
      utils.solveZipDir(project.metadata.name, {
        packageDir: project.metadata.packageDir,
        securitySchemaId: securitySchema.className
      }, securityHandlerTemplatePath),
      templatesFunctions[securityHandlerTemplatePath]({
        package: project.metadata.package,
        securitySchema: securitySchema,
        modelsCache: project.metadata.openapi.modelsCache
      }),
      false,
      zip
    )
  });

  // Generate operation tests
  let openapiClientMetadata = OpenAPIUtils.generateApiClientOpenapiMetadata(project); // Required to use api client in tests
  _.each(openapiClientMetadata.operations, (operation => {
    operation.className = OpenAPISanitizers.toClassName(operation.operationId);
    _.each(operation.responses, (response, statusCode) => {
      response.statusCode = (statusCode !== 'default') ? statusCode : undefined;
    });
    utils.addToZip(
      utils.solveZipDir(project.metadata.name, {
        packageDir: project.metadata.packageDir,
        operationId: operation.className
      }, testTemplatePath),
      templatesFunctions[testTemplatePath]({
        package: project.metadata.package,
        operation: operation,
        modelsCache: project.metadata.openapi.modelsCache
      }),
      false,
      zip
    )
  }));

  return OpenAPIUtils
    .generateModels(project, modelTemplatePath, zip)
    .then(zip => OpenAPIUtils.generateApiClient(project, openapiClientMetadata, zip, clientTemplatePath))
};

exports.generate = generate;
