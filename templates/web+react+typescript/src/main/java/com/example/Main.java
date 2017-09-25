package com.example;

import com.example.api.WeatherForecastAPI;
import io.vertx.core.AbstractVerticle;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.StaticHandler;

import io.vertx.ext.web.templ.HandlebarsTemplateEngine;

public class Main extends AbstractVerticle {

  @Override
  public void start() throws Exception {

    final HandlebarsTemplateEngine engine = HandlebarsTemplateEngine.create();
    final Router router = Router.router(vertx);

    router.get("/").handler(ctx -> {
      // we define a hardcoded title for our application
      ctx.put("title", "Home Page");

      engine.render(ctx, "templates", "/index.hbs", res -> {
        if (res.succeeded()) {
          ctx.response().end(res.result());
        } else {
          ctx.fail(res.cause());
        }
      });
    });

    // the example weather API
    router.get("/api/weather-forecasts").handler(new WeatherForecastAPI());

    // Serve the static resources
    router.route().handler(StaticHandler.create());

    vertx.createHttpServer().requestHandler(router::accept).listen(8080);
  }
}
