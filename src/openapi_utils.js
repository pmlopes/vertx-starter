let SwaggerParser = require('swagger-parser');
let YAML = SwaggerParser.YAML;
let _ = require('lodash')

let isBrowser = new Function("try {return this===window;}catch(e){ return false;}");

let sanitizeRegex = /([-\/.,_]+.)/g;
let magicReplace = (s) => s.replace(sanitizeRegex, v => v.slice(v.length-1, v.length).toUpperCase());

let oasMetadata = {
  types_map: {
      java: { // First nested is type, second nested is format
          object: "Map<String, Object>",
          array: "List<Object>",
          string: "String",
          integer: {
              int32: "Integer",
              int64: "Long",
              default: "Integer"
          },
          number: {
              float: "Float",
              double: "Double",
              default: "Float"
          },
          boolean: "Boolean",
          default: "Object"
      },
      kotlin: {
          object: "MutableMap<String, Any>?",
          array: "MutableList<String>?",
          string: "String?",
          integer: {
              int32: "Int?",
              int64: "Long?",
              default: "Int?"
          },
          number: {
              float: "Float?",
              double: "Double?",
              default: "Float?"
          },
          boolean: "Boolean?",
          default: "Any?"
      },
      groovy: { // First nested is type, second nested is format
          object: "Map<String, Object>",
          array: "List<Object>",
          string: "String",
          integer: {
              int32: "Integer",
              int64: "Long",
              default: "Integer"
          },
          number: {
              float: "Float",
              double: "Double",
              default: "Float"
          },
          boolean: "Boolean",
          default: "Object"
      },
  },
  client_parameters_functions_map: {
      default: {
          path: {
              array: {
                  matrix: {
                      true: "renderPathArrayMatrixExplode",
                      default: "renderPathArrayMatrix"
                  },
                  label: {
                      true: "renderPathArrayLabelExplode",
                      default: "renderPathArrayLabel"
                  },
                  simple: {
                      true: "renderPathArraySimpleExplode",
                      default: "renderPathArraySimple"
                  },
                  default: "renderPathArraySimple"
              },
              object: {
                  matrix: {
                      true: "renderPathObjectMatrixExplode",
                      default: "renderPathObjectMatrix"
                  },
                  label: {
                      true: "renderPathObjectLabelExplode",
                      default: "renderPathObjectLabel"
                  },
                  simple: {
                      true: "renderPathObjectSimpleExplode",
                      default: "renderPathObjectSimple"
                  },
                  default: "renderPathObjectSimple"
              },
              default: {
                  matrix: "renderPathMatrix",
                  label: "renderPathLabel",
                  default: "renderPathParam"
              }
          },
          query: {
              array: {
                  form: {
                      false: "addQueryArrayForm",
                      default: "addQueryArrayFormExplode"
                  },
                  spaceDelimited: "addQueryArraySpaceDelimited",
                  pipeDelimited: "addQueryArrayPipeDelimited",
                  default: "addQueryArrayFormExplode"
              },
              object: {
                  form: {
                      false: "addQueryObjectForm",
                      default: "addQueryObjectFormExplode"
                  },
                  spaceDelimited: "addQueryObjectSpaceDelimited",
                  pipeDelimited: "addQueryObjectPipeDelimited",
                  deepObject: "addQueryObjectDeepObjectExplode",
                  default: "addQueryObjectFormExplode"
              },
              default: "addQueryParam"
          },
          cookie: {
              array: {
                  default: {
                      true: "renderCookieArrayFormExplode",
                      default: "renderCookieArrayForm"
                  }
              },
              object: {
                  default: {
                      true: "renderCookieObjectFormExplode",
                      default: "renderCookieObjectForm"
                  }
              },
              default: "renderCookieParam"
          },
          header: {
              array: {
                  default: {
                      true: "addHeaderArraySimpleExplode",
                      default: "addHeaderArraySimple"
                  }
              },
              object: {
                  default: {
                      true: "addHeaderObjectSimpleExplode",
                      default: "addHeaderObjectSimple"
                  }
              },
              default: "addHeaderParam"
          },
      }
  }
}; //TODO put outside

function solveOasType(language, type, format) {
  return walkOasMetadata(oasMetadata.types_map, [language, type, format])
}

function sanitizeParameterName(oasName) {
  oasName = magicReplace(oasName.trim())
  return oasName.charAt(0).toLowerCase() + oasName.slice(1);
}

function convertModelNameToClassName(modelName) {
  let class_name = magicReplace(modelName);
  class_name = class_name.charAt(0).toUpperCase() + class_name.slice(1);
  return class_name;
}

function walkOasMetadata(metadata, path) {
  if (_.isString(metadata))
      return metadata;
  else
      return walkOasMetadata(_.get(metadata, (path) ? path.slice(0, 1) : "default", metadata.default), path.slice(1));
}

function loadOpenAPIAndValidate(file) {
  if (isBrowser()) {
    let parsedOpenapiObject = YAML.parse(file);
    return SwaggerParser
      .resolve(parsedOpenapiObject, {
        external: false
      })
      .then(refs => {
        return Promise.resolve({
          original: parsedOpenapiObject,
          refs: refs
        })
      });
  } else {
    return SwaggerParser
      .parse(file)
      .then(api => {
        return SwaggerParser
          .resolve(api)
          .then(refs => {
            return Promise.resolve({
              original: api,
              refs: refs
            })
          });
      });
  }
}

function resolveRefSchemaName(ref, schema) {
  return schema.title || ref.substring(ref.lastIndexOf('/') + 1)
}

function generateModel(modelTemplate, refsLoader, jsonSchema, schemaKey, packageName) {
  if (jsonSchema["$ref"]){
    return generateModel(
      modelTemplate,
      refsLoader,
      refsLoader.get(jsonSchema["$ref"]),
      jsonSchema["$ref"].substring(jsonSchema["$ref"].lastIndexOf('/') + 1),
      packageName
    );
  } else {
    let modelName = jsonSchema.title || schemaKey;
    jsonSchema = _.cloneDeep(jsonSchema);
    _.forEach(jsonSchema.properties, (schema, propName) => {
      if (schema['$ref']) {
        let solved = refsLoader.get(schema["$ref"]);
        if (solved) {
          schema["modelType"] = convertModelNameToClassName(resolveRefSchemaName(schema['$ref'], solved))
        }
      }
    });
    return {
      content: modelTemplate({
          schema: jsonSchema,
          modelName: convertModelNameToClassName(modelName),
          package: packageName
        }),
      filename: convertModelNameToClassName(modelName) + ".java"
    };
  }
}

function generateAllModels(modelTemplate, openapi, packageName) {
  return Object
    .keys(openapi.original.components.schemas)
    .map(key => generateModel(modelTemplate, openapi.refs, openapi.original.components.schemas[key], key, packageName))
}

exports.sanitizeParameterName = sanitizeParameterName
exports.solveOasType = solveOasType
exports.walkOasMetadata = walkOasMetadata
exports.loadOpenAPIAndValidate = loadOpenAPIAndValidate;
exports.generateAllModels = generateAllModels
