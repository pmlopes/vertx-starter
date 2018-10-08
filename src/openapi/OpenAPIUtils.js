let OpenAPISanitizers = require('./OpenAPISanitizers');
let OpenAPIMetadatahandler = require('./OpenAPIMetadataHandler')
let _ = require('lodash')

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
          throw new Error("Missing operation id for operation " + method + " "  + key)
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

function extractParametersOrganizedByIn(operation, language){
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

exports.getPathsByOperationIds = getPathsByOperationIds;
exports.extractParametersOrganizedByIn = extractParametersOrganizedByIn