let _ = require('lodash')

let utils = require('../utils.js')
let templatesFunctions = require('../gen/templates')
let OpenAPIUtils = require('../openapi/OpenAPIUtils')
let OpenAPISanitizers = require('../openapi/OpenAPISanitizers')

class OperationsCache {
  constructor(openapi) {
    this.classMapping = _.get(openapi.original, "components.x-vertx-service-gen", {});
    this.services = {};
    this.operationsOutOfServices = {}
  }

  handleDiscoveredService(operation, serviceName, serviceAddress, serviceMethodName) {
    serviceName = OpenAPISanitizers.toClassName(serviceName);
    serviceMethodName = OpenAPISanitizers.toVariableName(serviceMethodName);
    operation.serviceMethodName = serviceMethodName;
    if (_.has(this.services, serviceName)) {
      this.services[serviceName].operations.push(_.cloneDeep(operation));
    } else [
      this.services[serviceName] = {
        operations: [_.cloneDeep(operation)],
        address: serviceAddress
      }
    ]
  }

  addOperation(operation) {
    if (!_.has(operation, "x-vertx-event-bus")) {
      // Operation not connected to a service
      this.operationsOutOfServices[operation.operationId] = _.cloneDeep(operation);
    } else if (_.has(operation, "x-vertx-event-bus.class")) {
      // Service name inside operation definition
      this.handleDiscoveredService(
        operation,
        operation["x-vertx-event-bus"].class,
        _.get(operation, "x-vertx-event-bus.address", operation["x-vertx-event-bus"]),
        _.get(operation, "x-vertx-event-bus.method", OpenAPISanitizers.toVariableName(operation.operationId))
      );
    } else if (_.has(this.classMapping, _.get(operation, "x-vertx-event-bus.address", operation["x-vertx-event-bus"]))) {
      this.handleDiscoveredService(
        operation,
        _.get(this.classMapping, _.get(operation, "x-vertx-event-bus.address", operation["x-vertx-event-bus"])),
        _.get(operation, "x-vertx-event-bus.address", operation["x-vertx-event-bus"]),
        OpenAPISanitizers.toVariableName(operation.operationId)
      );
    } else {
      throw new Error("Cannot find service name for operation " + operation.operationId)
    }
  }

  isOperationLinkedToService(operationId) {
    return !_.has(this.operationsOutOfServices, operationId)
  }
}

let generate = (project, templates, zip) => {
  // merge all templates to be processed
  templates = utils.mergeTemplates(project, templates);
  let templatesToProcess = templates.filter(t => 
    !t.includes("modelName") && 
    !t.includes("Client") &&
    !t.includes("{operationId}Handler") &&
    !t.includes("{securitySchemaId}Handler") &&
    !t.includes("{operationId}Test") &&
    !t.includes("{serviceName}") &&
    !t.includes("MainVerticle")
  );

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
  let handlerTemplatePath = templates.find(t => t.includes("{operationId}Handler"))
  let securityHandlerTemplatePath = templates.find(t => t.includes("{securitySchemaId}Handler"))
  let testTemplatePath = templates.find(t => t.includes("{operationId}Test"))
  let mainVerticleTemplatePath = templates.find(t => /openapi-server-sp\/.*MainVerticle\..*/.test(t))
  let serviceInterfaceTemplatePath = templates.find(t => t.includes("{serviceName}."))
  let serviceImplTemplatePath = templates.find(t => t.includes("{serviceName}Impl."))
  let serviceTestTemplatePath = templates.find(t => t.includes("{serviceName}Test."))

  let operationsCache = new OperationsCache(project.metadata.openapi);

  // Load operations into operationsCache
  _.each(project.metadata.openapi.operations, (operation => {
    // Extract body schema
    operation.bodySchema = _.get(operation, ['requestBody', 'content', 'application/json', 'schema'])
    operationsCache.addOperation(operation);
  }));

  // Generate handlers and tests for operations without associated service
  _.each(operationsCache.operationsOutOfServices, (operation => {
    operation.className = OpenAPISanitizers.toClassName(operation.operationId)
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

  // Generate service, service impl and service test
  _.each(operationsCache.services, (service, serviceName) => {
    let pathMetadata = {
      packageDir: project.metadata.packageDir,
      serviceName: serviceName
    };
    let genMetadata = {
      package: project.metadata.package,
      operations: service.operations,
      serviceName: serviceName,
      modelsCache: project.metadata.openapi.modelsCache
    };

    utils.addToZip(
      utils.solveZipDir(project.metadata.name, pathMetadata, serviceInterfaceTemplatePath),
      templatesFunctions[serviceInterfaceTemplatePath](genMetadata),
      false,
      zip
    )
    utils.addToZip(
      utils.solveZipDir(project.metadata.name, pathMetadata, serviceImplTemplatePath),
      templatesFunctions[serviceImplTemplatePath](genMetadata),
      false,
      zip
    )
    utils.addToZip(
      utils.solveZipDir(project.metadata.name, pathMetadata, serviceTestTemplatePath),
      templatesFunctions[serviceTestTemplatePath](genMetadata),
      false,
      zip
    )

  })

  // Generate security handlers
  _.each(_.get(project.metadata.openapi.original, "components.securitySchemes", {}), (securitySchema, securitySchemaName) => {
    securitySchema.className = OpenAPISanitizers.toClassName(securitySchemaName)
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

  // Generate operation tests for operations not linked to any service
  let openapiClientMetadata = OpenAPIUtils.generateApiClientOpenapiMetadata(project); // Required to use api client in tests
  _.each(openapiClientMetadata.operations, (operation => {
    if (!operationsCache.isOperationLinkedToService(operation.operationId)) {
      operation.className = OpenAPISanitizers.toClassName(operation.operationId)
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
    }
  }));

  // Generate main verticle
  utils.addToZip(
    utils.solveZipDir(project.metadata.name, {
      packageDir: project.metadata.packageDir
    }, mainVerticleTemplatePath),
    templatesFunctions[mainVerticleTemplatePath]({
      package: project.metadata.package,
      securitySchemes: _.get(project.metadata.openapi.original, "components.securitySchemes", {}),
      services: operationsCache.services,
      operations: operationsCache.operationsOutOfServices,
      modelsCache: project.metadata.openapi.modelsCache
    }),
    false,
    zip
  )

  return OpenAPIUtils
    .generateModels(project, modelTemplatePath, zip)
    .then(zip => OpenAPIUtils.generateApiClient(project, openapiClientMetadata, zip, clientTemplatePath))
}

exports.generate = generate
