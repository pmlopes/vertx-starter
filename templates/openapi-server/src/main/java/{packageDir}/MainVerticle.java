package {{ metadata.package }};

import io.vertx.core.AbstractVerticle;
import io.vertx.core.http.HttpServer;
import io.vertx.core.http.HttpServerOptions;
import io.vertx.ext.web.api.contract.openapi3.OpenAPI3RouterFactory;
import io.vertx.ext.web.Router;
import io.vertx.core.Future;

import {{ metadata.package }}.handlers.*;
import {{ metadata.package }}.models.*;
{{#nonEmpty metadata.openapi.original.components.securitySchemes}}import {{ @root.metadata.package }}.security.*;
{{/nonEmpty}}

public class MainVerticle extends AbstractVerticle {

  HttpServer server;

  @Override
  public void start(Future future) {
    OpenAPI3RouterFactory.createRouterFactoryFromFile(this.vertx, getClass().getResource("/openapi.json").getFile(), openAPI3RouterFactoryAsyncResult -> {
      if (openAPI3RouterFactoryAsyncResult.succeeded()) {
        OpenAPI3RouterFactory routerFactory = openAPI3RouterFactoryAsyncResult.result();

        // Enable automatic response when ValidationException is thrown
        routerFactory.enableValidationFailureHandler(true);

        // Add routes handlers
{{#each metadata.openapi.operations}}        routerFactory.addHandlerByOperationId("{{ operationId }}", new {{toClassName operationId}}Handler());
{{/each}}

{{#nonEmpty metadata.openapi.original.components.securitySchemes}}        // Add security handlers
{{#each @root.metadata.openapi.original.components.securitySchemes}}        routerFactory.addSecurityHandler("{{ @key }}", new {{toClassName @key}}Handler());
{{/each}}{{/nonEmpty}}

        // Generate the router
        Router router = routerFactory.getRouter();
        server = vertx.createHttpServer(new HttpServerOptions().setPort(8080).setHost("localhost"));
        server.requestHandler(router::accept).listen();
        future.complete();
      } else {
          // Something went wrong during router factory initialization
          Throwable exception = openAPI3RouterFactoryAsyncResult.cause();
      }
    });
  }

  @Override
  public void stop(){
    this.server.close();
  }

}
