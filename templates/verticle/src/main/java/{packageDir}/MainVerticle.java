package {{ metadata.package }};

{{#if metadata.graalNativeImage}}
import io.vertx.core.Vertx;
{{/if}}
import io.vertx.core.AbstractVerticle;
{{#containsDep dependencies "io.vertx" "vertx-web"}}
import io.vertx.core.json.*;

import java.time.Instant;
import java.util.*;

import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.StaticHandler;
{{#containsDep dependencies "io.vertx" "vertx-web-templ-handlebars"}}
import io.vertx.ext.web.templ.HandlebarsTemplateEngine;
{{/containsDep}}
{{#containsDep dependencies "xyz.jetdrone" "hot-reload"}}
import xyz.jetdrone.vertx.hot.reload.HotReload;
{{/containsDep}}

import static java.time.temporal.ChronoUnit.DAYS;
{{/containsDep}}

public class MainVerticle extends AbstractVerticle {

  {{#if metadata.graalNativeImage}}
  public static void main(String[] args) {
    // TODO: configure your vertx options here
    Vertx.vertx().deployVerticle(new MainVerticle());
  }
  {{/if}}

  @Override
  public void start() {
    // your code goes here...

    {{#containsDep dependencies "io.vertx" "vertx-web"}}
    {{#containsDep dependencies "io.vertx" "vertx-web-templ-handlebars"}}
    final HandlebarsTemplateEngine engine = HandlebarsTemplateEngine.create();
    {{/containsDep}}
    final Router router = Router.router(vertx);

    {{#containsDep dependencies "xyz.jetdrone" "hot-reload"}}
    // development hot reload
    router.get().handler(HotReload.create());
    {{/containsDep}}

    router.get("/").handler(ctx -> {
      {{#containsDep dependencies "io.vertx" "vertx-web-templ-handlebars"}}
      // we define a hardcoded title for our application
      ctx.put("title", "Home Page");
      ctx.put("hotreload", System.getenv("VERTX_HOT_RELOAD"));

      engine.render(ctx, "templates", "/index.hbs", res -> {
        if (res.succeeded()) {
          ctx.response().end(res.result());
        } else {
          ctx.fail(res.cause());
        }
      });
      {{else}}
      ctx.response()
        .putHeader("content-type", "text/plain")
        .end("Hello from Vert.x!");
      {{/containsDep}}
    });

    // the example weather API
    List<String> SUMMARIES = Arrays.asList("Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching");

    router.get("/api/weather-forecasts").handler(ctx -> {
      final JsonArray response = new JsonArray();
      final Instant now = Instant.now();
      final Random rnd = new Random();

      for (int i = 1; i <= 5; i++) {
        JsonObject forecast = new JsonObject()
          .put("dateFormatted", now.plus(i, DAYS))
          .put("temperatureC", -20 + rnd.nextInt(35))
          .put("summary", SUMMARIES.get(rnd.nextInt(SUMMARIES.size())));

        forecast.put("temperatureF", 32 + (int) (forecast.getInteger("temperatureC") / 0.5556));

        response.add(forecast);
      }

      ctx.response()
        .putHeader("Content-Type", "application/json")
        .end(response.encode());
    });

    // Serve the static resources
    router.route().handler({{#containsDep dependencies "xyz.jetdrone" "hot-reload"}}HotReload.createStaticHandler(){{else}}StaticHandler.create(){{/containsDep}});
    {{/containsDep}}

    vertx.createHttpServer().requestHandler({{#containsDep dependencies "io.vertx" "vertx-web"}}router::accept{{else}}req -> {
      req.response()
        .putHeader("content-type", "text/plain")
        .end("Hello from Vert.x!");
    }{{/containsDep}}).listen(8080, res -> {
      if (res.failed()) {
        res.cause().printStackTrace();
      } else {
        System.out.println("Server listening at: http://localhost:8080/");
      }
    });
  }
}
