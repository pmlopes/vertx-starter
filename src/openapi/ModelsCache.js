let _ = require('lodash');
let OpenAPISanitizers = require('./OpenAPISanitizers');

exports.ModelsCache = class ModelsCache {
    constructor(openapi) {
      this.openapi = openapi;
      this.models = {};
    }

    isAllOf(schema) {
      return schema.hasOwnProperty("allOf");
    }

    isObjectType(schema) {
      return (schema.type !== undefined && schema.type === "object") || schema.hasOwnProperty("properties")
    }

    isArrayType(schema) {
      return (schema.type !== undefined && schema.type === "array") || schema.hasOwnProperty("items")
    }

    mergeSchemas(schemas) {
      let newSchema = {};
      newSchema.type = "object";
      newSchema.properties = _.chain(schemas).map(t => t.properties).filter(_.isObject).reduce(_.assign, {}).value();
      newSchema.required = _.union(...(_.chain(schemas).map(t => t.required).filter(_.isArray).value()));
      return newSchema;
    }

    handleJustDiscoveredSchema(schema, thisRef, maybeModelName) {
      if (schema["$ref"]) {
        let ref = schema["$ref"];
        schema = this.openapi.refs.get(schema["$ref"]);
        _.set(schema, "$ref", ref);
      }
      // Generate model only and only if this is not a solved ref already in models cache
      if (!schema["$ref"] || (!!schema["$ref"] && !this.hasModel(schema["$ref"]))) {
        if (this.isObjectType(schema)) {
          _.set(schema, "$thisref", thisRef);
          this.addModelToParse(thisRef, schema, maybeModelName);
        } else if (this.isAllOf(schema)) {
          // Solve all schemas
          let schemas = _.map(schema.allOf, (s, i) => (s["$ref"]) ? this.openapi.refs.get(s["$ref"]) : s);
          let mergedSchema = this.mergeSchemas(schemas);
          _.set(mergedSchema, "$thisref", thisRef);
          this.addModelToParse(thisRef, mergedSchema, maybeModelName);
        }
      } else if (this.isArrayType(schema) && (this.isObjectType(schema.items) || schema.items["$ref"])) {
        schema.items = this.handleJustDiscoveredSchema(schema.items, thisRef + "/items", maybeModelName + "Item")
      }
      return schema;
    }
  
    addModelToParse(ref, jsonSchema, maybeModelName) {
      if (this.isObjectType(jsonSchema)) {
        if (!this.models[ref] && !_.find(this.models, m => m === jsonSchema)) {
          this.models[ref] = _.cloneDeep(jsonSchema);
        }
        this.models[ref].modelType = OpenAPISanitizers.toClassName(
          this.models[ref].modelType || this.models[ref].title || maybeModelName
        );
      }

    }

    solveModelType(ref, primitiveTypeSolver) {
      let s = this.models[ref] || this.openapi.refs.get(ref);
      return s.modelType || primitiveTypeSolver(s.type, s.format);
    }
  
    hasModel(ref) {
      return !!this.models[ref];
    }

    generateSingleModel(modelTemplate, refsLoader, jsonSchema, maybeModelName, packageName) {
        if (jsonSchema["$ref"] && _.size(jsonSchema) === 1) {
          return generateModel(
            modelTemplate,
            refsLoader,
            this.hasModel(jsonSchema["$ref"]) ? this.models[jsonSchema["$ref"]] : refsLoader.get(jsonSchema["$ref"]),
            jsonSchema["$ref"].substring(jsonSchema["$ref"].lastIndexOf('/') + 1),
            packageName
          );
        } else {
          if (!this.isObjectType(jsonSchema)) return undefined;
          jsonSchema.modelType = OpenAPISanitizers.toClassName(
            jsonSchema.modelType || jsonSchema.title || maybeModelName
          );
          return {
            content: modelTemplate({
              schema: jsonSchema,
              modelName: jsonSchema.modelType,
              package: packageName,
              modelsCache: this
            }),
            modelName: jsonSchema.modelType
          };
        }
      }
  
    generateModels(modelTemplate, packageName) {
      // _.each(this.models, (model, ref) => {
      //   if (this.isArrayType(model.type) && _.has(model, "items.$ref")) {
      //     model.items.modelType = this.models[model.items["$ref"]].modelName;
      //   } else if (this.isObjectType(model.type)) {
      //     _.each(model.properties, (schema, propName) => {
      //       if (schema['$ref']) {
      //         schema.modelType = this.solveModelType(schema["$ref"], primitiveTypeSolver);
      //       }
      //     });
      //   }
      // });
      return _.map(this.models, (jsonSchema) => 
        this.generateSingleModel(modelTemplate, this.openapi.refs, jsonSchema, jsonSchema.modelType, packageName)
      ).filter(x => x !== undefined)
    }
  };
