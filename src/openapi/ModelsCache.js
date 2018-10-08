let _ = require('lodash');
let OpenAPISanitizers = require('./OpenAPISanitizers')

exports.ModelsCache = class ModelsCache {
    constructor(openapi) {
      this.openapi = openapi;
      this.models = {};
    }

    handleJustDiscoveredSchema(schema, thisRef, maybeModelName) {
      if (schema["$ref"]) {
        let ref = schema["$ref"];
        schema = this.openapi.refs.get(schema["$ref"]);
        _.set(schema, "$ref", ref);
      }
      // Generate model only and only if this is not a solved ref already in models cache and is an object
      if (schema.type === 'object' && (!schema["$ref"] || (!!schema["$ref"] && !this.hasModel(schema["$ref"])))) {
        _.set(schema, "$thisref", thisRef)
        this.addModelToParse(thisRef, schema, maybeModelName);
      } else if (schema.type === 'array' && (schema.items.type === 'object' || schema.items["$ref"])) {
        schema.items = this.handleJustDiscoveredSchema(schema.items, thisRef + "/items", maybeModelName + "Item")
      }
      return schema;
    }
  
    addModelToParse(ref, jsonSchema, maybeModelName) {
      if (jsonSchema.type === "object") {
        if (!this.models[ref] && !_.find(this.models, m => m === jsonSchema)) {
          this.models[ref] = jsonSchema;
        }
        this.models[ref].modelType = OpenAPISanitizers.toClassName(
          this.models[ref].modelType || this.models[ref].title || maybeModelName
        );
      }
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
          if (jsonSchema.type !== "object") return undefined;
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
      _.each(this.models, (model, ref) => {
        if (model.type === "array" && _.has(model, "items.$ref")) {
          model.items.modelType = this.models[model.items["$ref"]].modelName;
        } else if (model.type === "object" && model.properties) {
          _.each(model.properties, (schema, propName) => {
            if (schema['$ref']) {
              schema.modelType = this.models[schema["$ref"]].modelName;
            }
          });
        }
      });
      return _.map(this.models, (jsonSchema) => 
        this.generateSingleModel(modelTemplate, this.openapi.refs, jsonSchema, jsonSchema.modelType, packageName)
      ).filter(x => x !== undefined)
    }
  }