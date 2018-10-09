exports.metadata = {
    types_map: {
      java: { // First nested is type, second nested is format
        object: "Map<String, Object>",
        array: "List<Object>",
        array_template: (it) => "List<" + it + ">", 
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
    types_conversion: {
      java: {
        model_to_map: (paramName) =>  paramName + ".toJson().getMap()",
        model_to_json: (paramName) =>  paramName + ".toJson()",
        primitive_array_to_list: (paramName) => "(List)" + paramName,
        model_array_to_list: (paramName) => "((List)" + paramName + ".stream().map(o -> o.toJson().toMap()).collect(Collectors.toList()))",
        model_array_to_json: (paramName) => "new JsonArray(" + paramName + ".stream().map(o -> o.toJson()).collect(Collectors.toList()))"
      }
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
};