let _ = require('lodash')

let OpenAPISanitizers = require('./OpenAPISanitizers');
let OpenAPIMetadatahandler = require('./OpenAPIMetadataHandler')
let ModelsCache = require('./ModelsCache').ModelsCache
let templatesFunctions = require('../gen/templates')
let utils = require('../utils')


function cloneOpenAPIMetadataContainer(old) {
  return {
    refs: old.refs,
    original: _.cloneDeep(old.original),
    securitySchemes: _.cloneDeep(old.securitySchemes),
    operations: _.cloneDeep(old.operations),
    modelsCache: old.modelsCache
  }
}

/**
 * Load all operations organized in an object with operationId as keys and operation as value.
 * This also merges parameters from path definition and deference $refs
 * @param {*} openapi 
 */
function getPathsByOperationIds(openapi, failOnMissingOperationId = true) {
  let result = {};
  let oas = openapi.original;
  for (let key in oas.paths) {
    let path = (oas.paths[key]["$ref"]) ? openapi.refs.get(oas.paths[key]["$ref"]) : oas.paths[key];
    for (let method in path) {
      let operation = (path[method]["$ref"]) ? openapi.refs.get(path[method]["$ref"]) : path[method];
      let operationId = operation.operationId;
      if (!operationId) {
        if (failOnMissingOperationId) {
          throw new Error("Missing operation id for operation " + method + " " + key)
        } else {
          operationId = OpenAPISanitizers.generateOperationId(method, key);
        }
      }
      result[operationId] = _.cloneDeep(operation);
      result[operationId]['operationId'] = operationId
      result[operationId]['parameters'] = _.unionBy(result[operationId]['parameters'], path.parameters, "name");
      result[operationId]['parameters'] = result[operationId]['parameters'].map((op) => (op["$ref"]) ? openapi.refs.get(op["$ref"]) : op);
      result[operationId]['method'] = _.clone(method);
      result[operationId]['path'] = _.clone(key);
      result[operationId]['operationId'] = _.clone(operationId);
      result[operationId]['sanitizedOperationId'] = OpenAPISanitizers.sanitize(operationId);
    }
  }
  return result;
}

function extractParametersOrganizedByIn(operation, language) {
  let result = {
    header: [],
    query: [],
    path: [],
    cookie: []
  };

  if (operation.parameters)
    _.forEach(operation.parameters, (e) => {
      e.sanitizedName = OpenAPISanitizers.toVariableName(e.name);
      e.renderFunctionName = OpenAPIMetadatahandler.solveFunctionNameForParameterRendering(language, e.in, e.schema.type, e.style, e.explode)
      result[e.in].push(e);
    });

  return result;
}

function buildOpenAPIBaseMetadata(oldOpenAPI, failOnMissingOperationId) {
  var openapi = {
    refs: oldOpenAPI.refs,
    original: _.cloneDeep(oldOpenAPI.original)
  }

  // This foreach tries to generate models for all definitions in components
  let modelsCache = new ModelsCache(openapi);
  if (_.has(openapi.original, "components.schemas"))
    _.forEach(openapi.original.components.schemas, (schema, name) => {
      modelsCache.addModelToParse("#/components/schemas/" + name, schema, name);
    });

  openapi.operations = getPathsByOperationIds(openapi, failOnMissingOperationId)

  _.forOwn(openapi.operations, (operation, key) => {
    // Load $ref
    if (_.has(operation, "requestBody.$ref")) {
      operation.requestBody = openapi.refs.get(operation.requestBody["$ref"]);
    }

    // Load request bodies schemas
    if (_.has(operation, "requestBody.content") && !_.isEmpty(operation.requestBody.content)) {
      _.forOwn(operation.requestBody.content, (content, contentType) => {
        if (content.schema) {
          content.schema = modelsCache.handleJustDiscoveredSchema(
            content.schema,
            "#/paths" + operation.path + "/" + operation.method + "/requestBody/content/" + contentType + "/schema",
            (_.size(operation.requestBody.content) > 1) ? (
              (contentType.includes("json")) ? operation.sanitizedOperationId + "JSONRequestBody" :
                (contentType === "multipart/form-data") ? operation.sanitizedOperationId + "MultipartFormRequestBody" :
                  (contentType === "application/x-www-form-urlencoded") ? operation.sanitizedOperationId + "FormRequestBody" :
                    operation.sanitizedOperationId + OpenAPISanitizers.sanitizeContentType(contentType) + "RequestBody"
            ) : operation.sanitizedOperationId + "RequestBody"
          );
        }
      });
    }

    // Handle newly discovered parameters schemas and add to operation
    operation.parameters = _.mapValues(operation.parameters, (param, i) => {
      if (param.schema) {
        param.schema = modelsCache.handleJustDiscoveredSchema(
          param.schema,
          "#/paths" + operation.path + "/" + operation.method + "/parameters/" + i,
          operation.sanitizedOperationId + param.name + "Param"
        )
      }
      return param
    });

    // Remap parameters in object organized by parameter location
    operation.parsedParameters = extractParametersOrganizedByIn(
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

  openapi.modelsCache = modelsCache;

  return openapi;

}

function generateApiClient(project, clientTemplatePath, zip) {
  var openapi = cloneOpenAPIMetadataContainer(project.metadata.openapi);

  // Generate method names
  _.forOwn(openapi.operations, (operation, key) => {
    // Generate functions based on request bodies
    let baseFunctionName = OpenAPISanitizers.sanitize(key);
    operation.functions = [];
    if (!_.has(operation, "requestBody.content") || _.isEmpty(operation.requestBody.content)) {
      operation.functions.push({ name: baseFunctionName, empty: true });
    } else {
      operation.functions.push({ name: baseFunctionName + "WithEmptyBody", empty: true });
      _.forOwn(operation.requestBody.content, (content, contentType) => {
        if (contentType.includes("json")) {
          operation.functions.push({
            name: baseFunctionName + "WithJson",
            json: true,
            contentType: contentType,
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
            name: baseFunctionName + "With" + OpenAPISanitizers.sanitizeContentType(contentType) + "Buffer",
            buffer: true,
            contentType: contentType
          });
          operation.functions.push({
            name: baseFunctionName + "With" + OpenAPISanitizers.sanitizeContentType(contentType) + "Stream",
            stream: true,
            contentType: contentType
          });
        }
      });
    }
  });

  // Render client template
  utils.addToZip(
    utils.solveZipDir(project.metadata.name, project.metadata, clientTemplatePath),
    templatesFunctions[clientTemplatePath]({
      package: project.metadata.package,
      openapiSpec: openapi.original,
      operations: openapi.operations,
      modelsCache: openapi.modelsCache
    }),
    false,
    zip
  )

  return Promise.resolve(zip);

}

function generateModels(project, modelTemplatePath, zip) {
  _.forEach(
    project.metadata.openapi.modelsCache.generateModels(
      templatesFunctions[modelTemplatePath],
      project.metadata.package
    ),
    (m) => {
      utils.addToZip(
        utils.solveZipDir(project.metadata.name, { modelName: m.modelName, packageDir: project.metadata.packageDir }, modelTemplatePath),
        m.content,
        false,
        zip)
    }
  );

  return Promise.resolve(zip)
}

exports.getPathsByOperationIds = getPathsByOperationIds;
exports.extractParametersOrganizedByIn = extractParametersOrganizedByIn;
exports.buildOpenAPIBaseMetadata = buildOpenAPIBaseMetadata;
exports.generateApiClient = generateApiClient;
exports.generateModels = generateModels;