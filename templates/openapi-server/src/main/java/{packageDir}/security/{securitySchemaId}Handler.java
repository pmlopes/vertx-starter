package {{package}}.security;

import io.vertx.core.Handler;
import io.vertx.ext.web.RoutingContext;

public class {{ securitySchema.className }}Handler implements Handler<RoutingContext> {

    public {{ securitySchema.className }}Handler(){

    }

    @Override
    public void handle(RoutingContext routingContext) {
        // Handle {{ securitySchema.name }} security schema
        routingContext.next();
    }

}