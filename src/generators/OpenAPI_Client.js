let _ = require('lodash')

let utils = require('../utils.js')
let templatesFunctions = require('../gen/templates')
let ModelsCache = require('../openapi/ModelsCache').ModelsCache
let OpenAPIUtils = require('../openapi/OpenAPIUtils')
let OpenAPISanitizer = require('../openapi/OpenAPISanitizers')

let generate = (project, templates, zip) => {
  // merge all templates to be processed
  templates = utils.mergeTemplates(project, templates);
  let templatesToProcess = templates.filter(t => !t.includes("modelName") && !t.includes("Client"));

  // build all templates
  for (let i = 0; i < templatesToProcess.length; i++) {
    try {
      utils.compileAndAddToZip(project, templatesToProcess[i], project.executables.indexOf(templatesToProcess[i]) !== -1, zip);
    } catch(e) {
      return Promise.reject(e)
    }
  }

  // This foreach tries to generate models for all definitions in components
  let modelsCache = new ModelsCache(project.metadata.openapi);
  if (_.has(project.metadata.openapi.original, "components.schemas"))
  _.forEach(project.metadata.openapi.original.components.schemas, (schema, name) => {
    modelsCache.addModelToParse("#/components/schemas/" + name, schema, name);
  });
  
  project.metadata.openapi.operations = OpenAPIUtils.getPathsByOperationIds(project.metadata.openapi, false)
  
  _.forOwn(project.metadata.openapi.operations, (operation, key) => {
      // Generate functions based on request bodies
      let baseFunctionName = OpenAPISanitizer.sanitize(key);
      operation.functions = [];
      if (_.has(operation, "requestBody.$ref")) {
        operation.requestBody = project.metadata.openapi.refs.get(operation.requestBody["$ref"]);
      }
      if (!_.has(operation, "requestBody.content") || _.isEmpty(operation.requestBody.content)) {
          operation.functions.push({name: baseFunctionName, empty: true});
      } else {
          operation.functions.push({name: baseFunctionName + "WithEmptyBody", empty: true});
          _.forOwn(operation.requestBody.content, (content, contentType) => {
            if (contentType.includes("json")) {
              if (content.schema) {
                content.schema = modelsCache.handleJustDiscoveredSchema(
                  content.schema,
                  "#/paths" + operation.path + "/" + operation.method + "/requestBody/content/" + contentType + "/schema",
                  operation.sanitizedOperationId + "RequestBody"
                );
              }
              operation.functions.push({
                name: baseFunctionName + "WithJson",
                json: true,
                contentType:contentType,
                schema: content.schema
              });
            } else if (contentType == "multipart/form-data")
                operation.functions.push({
                  name: baseFunctionName + "WithMultipartForm",
                  form: true,
                  contentType: contentType
                });
            else if (contentType == "application/x-www-form-urlencoded")
                operation.functions.push({
                  name: baseFunctionName + "WithForm",
                  form: true,
                  contentType: contentType
                });
            else {
                operation.functions.push({
                    name: baseFunctionName + "With" + OAS3Utils.sanitizeContentType(contentType) + "Buffer",
                    buffer: true,
                    contentType: contentType
                });
                operation.functions.push({
                    name: baseFunctionName + "With" + OAS3Utils.sanitizeContentType(contentType) + "Stream",
                    stream: true,
                    contentType: contentType
                });
            }
          });
      }

      // Map security functions
      if (operation.security)
      // Generate an object with security schemas as keys and sanitized secuirity schema names as values
      operations[key].security = _.mapValues(
        _.keyBy(_.flatten(_.map(operation.security, (value) => _.keys(value)))),
        (value) => OpenAPISanitizer.sanitize(value)
      );

      // Handle newly discovered schemas and add to operation
      operation.parameters = _.mapValues(operation.parameters, (param, i) => {
        param.schema = modelsCache.handleJustDiscoveredSchema(
          param.schema,
          "#/paths" + operation.path + "/" + operation.method + "/parameters/" + i,
          operation.sanitizedOperationId + param.name + "Param"
        )
        return param
      });
      operation.parsedParameters = OpenAPIUtils.extractParametersOrganizedByIn(
        operation, "java"
      )

      // Solve responses models
      _.each(operation.responses, (response, responseCode) => {
        if (_.has(response, ["content", "application/json", "schema"])) {
          return modelsCache.handleJustDiscoveredSchema(
            response.content["application/json"].schema,
            "#/paths" + operation.path + "/" + operation.method + "/responses/" + responseCode + "/content/application/json/schema",
            operation.sanitizedOperationId + responseCode + "Response"
          );
        }
      });
  });

  // Prepare security schemas array
  project.metadata.openapi.securitySchemas = _.get(project.metadata.openapi.original, 'components.securitySchemes', []);
  _.forOwn(project.metadata.openapi.securitySchemas, (value, key) => {
      value.sanitized_schema_name = magicReplace(key);
  });

  // Render generated models
  let modelTemplatePath = templates.find(t => t.includes("modelName"));
  _.forEach(
    modelsCache.generateModels(
        templatesFunctions[modelTemplatePath],
        project.metadata.package
      ),
    (m) => {
      utils.addToZip(
        utils.solveZipDir(project.metadata.name, {modelName: m.modelName, packageDir: project.metadata.packageDir}, modelTemplatePath),
        m.content,
        false,
        zip)
      }
  );

  // Render ApiClient
  let clientTemplatePath = templates.find(t => t.includes("Client"));
  utils.addToZip(
    utils.solveZipDir(project.metadata.name, project.metadata, clientTemplatePath),
    templatesFunctions[clientTemplatePath]({
      package: project.metadata.package,
      security_schemas: project.metadata.openapi.securitySchemas,
      operations: project.metadata.openapi.operations,
      modelsCache: modelsCache
    }),
    false,
    zip
  )

  return Promise.resolve(zip);
};

exports.generate = generate;
