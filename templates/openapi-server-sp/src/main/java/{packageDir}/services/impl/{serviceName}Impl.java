package {{package}}.services.impl;

import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.ext.web.api.*;

import java.util.List;
import java.util.Map;

import {{package}}.models.*;
import {{package}}.services.{{serviceName}};

public class {{serviceName}}Impl implements {{serviceName}} {

  private Vertx vertx;

  public {{serviceName}}Impl(Vertx vertx) {
    this.vertx = vertx;
  }

{{#each operations}}  @Override
  public void {{serviceMethodName}}(
{{#each parsedParameters.path}}    {{solveOasTypeForService 'java' schema @root.modelsCache}} {{sanitizedName}},
{{/each}}{{#each parsedParameters.cookie}}    {{solveOasTypeForService 'java' schema @root.modelsCache}} {{sanitizedName}},
{{/each}}{{#each parsedParameters.query}}    {{solveOasTypeForService 'java' schema @root.modelsCache}} {{sanitizedName}},
{{/each}}{{#each parsedParameters.header}}    {{solveOasTypeForService 'java' schema @root.modelsCache}} {{sanitizedName}},
{{/each}}{{#if bodySchema}}    {{solveOasTypeForService 'java' bodySchema @root.modelsCache}} body,
{{/if}}    OperationRequest context, Handler<AsyncResult<OperationResponse>> resultHandler){
    // Write your business logic here
    resultHandler.handle(Future.succeededFuture(new OperationResponse().setStatusCode(501).setStatusMessage("Not Implemented")));
  }

{{/each}}
}
