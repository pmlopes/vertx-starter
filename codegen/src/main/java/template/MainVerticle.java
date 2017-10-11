package template;

import io.vertx.core.AbstractVerticle;

import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.StaticHandler;
import io.vertx.ext.web.templ.HandlebarsTemplateEngine;
import xyz.jetdrone.vertx.hot.reload.HotReload;
import template.api.WeatherForecastAPI;

public class MainVerticle extends AbstractVerticle {

  @Override
  public void start() {
    // your code goes here...
    final HandlebarsTemplateEngine engine = HandlebarsTemplateEngine.create();
    final Router router = Router.router(vertx);

    // development hot reload
    router.get().handler(HotReload.create());

    router.get("/").handler(ctx -> {
      // we define a hardcoded title for our application
      ctx.put("title", "Home Page");
      ctx.put("hotreload", "1");

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
    router.route().handler(HotReload.createStaticHandler());
    vertx.createHttpServer().requestHandler(router::accept).listen(8080, res -> {
      if (res.failed()) {
        res.cause().printStackTrace();
      } else {
        System.out.println("Server listening at: http://localhost:8080/");
      }
    });
  }
}
