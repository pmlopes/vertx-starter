package {{ package }};

import io.vertx.core.AbstractVerticle;
import io.vertx.core.eventbus.MessageConsumer;
import io.vertx.core.http.HttpServer;
import io.vertx.core.http.HttpServerOptions;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.api.contract.openapi3.OpenAPI3RouterFactory;
import io.vertx.ext.web.Router;
import io.vertx.core.Future;
import io.vertx.serviceproxy.ServiceBinder;

import {{ package }}.services.*;
import {{ package }}.handlers.*;
import {{ package }}.models.*;
{{#nonEmpty securitySchemes}}import {{ @root.package }}.security.*;
{{/nonEmpty}}

import java.util.List;

public class MainVerticle extends AbstractVerticle {

  HttpServer server;
  ServiceBinder serviceBinder;

  List<MessageConsumer<JsonObject>> registeredConsumers;

  /**
   * This method starts all services
   */
  private void startServices() {
    this.serviceBinder = new ServiceBinder(vertx);
    this.registeredConsumers = new ArrayList<>();

{{#each services}}    {{@key}} {{toVariableName @key}} = {{@key}}.create(vertx);
    registeredConsumers.add(
      serviceBinder
        .setAddress("{{address}}")
        .register({{@key}}.class, {{toVariableName @key}})
    );
{{/each}}
  }

  /**
   * This method constructs the router factory, mounts services and handlers and starts the http server with built router
   * @return
   */
  private Future<Void> startHttpServer() {
    Future<Void> future = Future.future();
    OpenAPI3RouterFactory.create(this.vertx, getClass().getResource("/openapi.yaml").getFile(), openAPI3RouterFactoryAsyncResult -> {
      if (openAPI3RouterFactoryAsyncResult.succeeded()) {
        OpenAPI3RouterFactory routerFactory = openAPI3RouterFactoryAsyncResult.result();

        // Enable automatic response when ValidationException is thrown
        routerFactory.setOptions(new RouterFactoryOptions().setMountValidationFailureHandler(true));

        // Mount services on event bus based on extensions
        routerFactory.mountServicesFromExtensions();

{{#each operations}}        routerFactory.addHandlerByOperationId("{{ operationId }}", new {{toClassName operationId}}Handler());
{{/each}}

{{#nonEmpty securitySchemes}}        // Add security handlers
{{#each @root.securitySchemes}}        routerFactory.addSecurityHandler("{{ @key }}", new {{toClassName @key}}Handler());
{{/each}}{{/nonEmpty}}


        // Generate the router
        Router router = routerFactory.getRouter();
        server = vertx.createHttpServer(new HttpServerOptions().setPort(8080).setHost("localhost"));
        server.requestHandler(router).listen();
        future.complete();
      } else {
        // Something went wrong during router factory initialization
        future.fail(openAPI3RouterFactoryAsyncResult.cause());
      }
    });
    return future;
  }

  @Override
  public void start(Future<Void> future) {
    startServices();
    startHttpServer().setHandler(future.completer());
  }

  /**
   * This method closes the http server and unregister all services loaded to Event Bus
   */
  @Override
  public void stop(){
    this.server.close();
    registeredConsumers.forEach(c -> serviceBinder.unregister(c));
  }

}
