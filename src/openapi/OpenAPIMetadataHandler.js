let _ = require('lodash')
let oasMetadata = require('./OpenAPIMetadata').metadata;

function walkOasMetadata(metadata, path) {
  if (_.isString(metadata) || _.isFunction(metadata))
    return metadata;
  else
    return walkOasMetadata(_.get(metadata, (path) ? path.slice(0, 1) : "default", metadata.default), path.slice(1));
}

function solvePrimitiveOasType(language, type, format) {
  return walkOasMetadata(oasMetadata.types_map, [language, type, format])
}

function solveFunctionNameForParameterRendering(language, paramLocation, type, style, explode) {
  return walkOasMetadata(oasMetadata.client_parameters_functions_map, [language, paramLocation, type, style, explode])
}

function solveOasType(language, schema, modelsCache) {
  if (schema["$thisref"]) {
    return modelsCache.models[schema["$thisref"]].modelType;
  } else if (schema["$ref"] && (!schema.type || schema.type !== "array")) {
    if (modelsCache.hasModel(schema["$ref"])) {
      return modelsCache.models[schema["$ref"]].modelType;
    } else {
      return solvePrimitiveOasType(language, "default");
    }
  } else if (schema.type === "array") {
    return oasMetadata.types_map[language].array_template(
      solveOasType(language, schema.items, modelsCache)
    )
  } else if (_.has(schema, "anyOf") && _.has(schema, "oneOf") && _.has(schema, "allOf")) {
    return oasMetadata.types_map[language].default;
  } else
    return solvePrimitiveOasType(language, schema.type, schema.format);
}

function solveOasTypeForService(language, schema, modelsCache) {
  if (schema["$thisref"]) {
    return modelsCache.models[schema["$thisref"]].modelType;
  } else if (schema["$ref"] && (!schema.type || schema.type !== "array")) {
    if (modelsCache.hasModel(schema["$ref"])) {
      return modelsCache.models[schema["$ref"]].modelType;
    } else {
      return "RequestParameter";
    }
  } else if (schema.type === "array") {
    return oasMetadata.types_map[language].array_template(
      solveOasType(language, schema.items, modelsCache)
    )
  } else if (_.has(schema, "anyOf") && _.has(schema, "oneOf") && _.has(schema, "allOf")) {
    return "RequestParameter";
  } else
    return solvePrimitiveOasType(language, schema.type, schema.format);
}

function castIfNeeded(language, paramName, schema, modelsCache) {
  if (schema["$thisref"]) {
    return oasMetadata.types_conversion[language].model_to_map(paramName);
  } else if (schema["$ref"] && modelsCache.hasModel(schema["$ref"])) {
    return oasMetadata.types_conversion[language].model_to_map(paramName);
  } else if (schema.type === "array") {
    if (schema.items["$thisref"] || (schema.items["$ref"] && modelsCache.hasModel(schema.items["$ref"]))) {
      return oasMetadata.types_conversion[language].model_array_to_list(paramName);
    } else {
      return oasMetadata.types_conversion[language].primitive_array_to_list(paramName);
    }
  }
  return paramName;
}

function castBodyIfNeeded(language, paramName, schema, modelsCache) {
  if (schema["$thisref"]) {
    return oasMetadata.types_conversion[language].model_to_json(paramName);
  } else if (schema["$ref"] && modelsCache.hasModel(schema["$ref"])) {
    return oasMetadata.types_conversion[language].model_to_json(paramName);
  } else if (schema.type === "array") {
    if (schema.items["$thisref"] || (schema.items["$ref"] && modelsCache.hasModel(schema.items["$ref"]))) {
      return oasMetadata.types_conversion[language].model_array_to_json(paramName);
    }
  }
  return paramName;
}

function isPrimitiveType(language, langType) {
  let types = oasMetadata.types_map[language];
  return !!(_.chain(types)
    .map(v => v)
    .flatMap(v => (_.isObject(v)) ? _.map(v, x => x) : [v])
    .filter(_.isString)
    .find(v => v.includes(lan)))
}

exports.solvePrimitiveOasType = solvePrimitiveOasType
exports.solveFunctionNameForParameterRendering = solveFunctionNameForParameterRendering
exports.solveOasType = solveOasType
exports.solveOasTypeForService = solveOasTypeForService
exports.isPrimitiveType = isPrimitiveType
exports.castIfNeeded = castIfNeeded
exports.castBodyIfNeeded = castBodyIfNeeded