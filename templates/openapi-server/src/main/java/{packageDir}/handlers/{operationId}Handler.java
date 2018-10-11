package {{package}}.handlers;

import io.vertx.core.Handler;
import io.vertx.ext.web.api.RequestParameters;
import io.vertx.ext.web.RoutingContext;

public class {{ operation.className }}Handler implements Handler<RoutingContext> {

    public {{ operation.className }}Handler(){

    }

    @Override
    public void handle(RoutingContext routingContext) {
        {{#or (nonEmpty operation.parsedParameters.path) (nonEmpty operation.parsedParameters.cookie) (nonEmpty operation.parsedParameters.query) (nonEmpty operation.parsedParameters.header)}}RequestParameters params = routingContext.get("parsedParameters");
        {{/or}}// Handle {{ operation.operationId }}
        routingContext.response().setStatusCode(501).setStatusMessage("Not Implemented").end();
    }

}