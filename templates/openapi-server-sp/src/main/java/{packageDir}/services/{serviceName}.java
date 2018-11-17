package {{package}}.services;

import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.ext.web.api.*;
import io.vertx.ext.web.api.generator.WebApiServiceGen;

import java.util.List;
import java.util.Map;

import {{package}}.models.*;
import {{package}}.services.impl.{{serviceName}}Impl;

@WebApiServiceGen
public interface {{serviceName}} {

  static {{serviceName}} create(Vertx vertx) {
    return new {{serviceName}}Impl(vertx);
  }

{{#each operations}}  void {{serviceMethodName}}(
{{#each parsedParameters.path}}    {{solveOasTypeForService 'java' schema @root.modelsCache}} {{sanitizedName}},
{{/each}}{{#each parsedParameters.cookie}}    {{solveOasTypeForService 'java' schema @root.modelsCache}} {{sanitizedName}},
{{/each}}{{#each parsedParameters.query}}    {{solveOasTypeForService 'java' schema @root.modelsCache}} {{sanitizedName}},
{{/each}}{{#each parsedParameters.header}}    {{solveOasTypeForService 'java' schema @root.modelsCache}} {{sanitizedName}},
{{/each}}{{#if bodySchema}}    {{solveOasTypeForService 'java' bodySchema @root.modelsCache}} body,
{{/if}}    OperationRequest context, Handler<AsyncResult<OperationResponse>> resultHandler);

{{/each}}
}
