package {{ metadata.packageName }};

{{#if metadata.graalNativeImage}}
import io.vertx.core.Vertx;
{{else}}
import io.vertx.core.AbstractVerticle;
{{/if}}
{{#if dependenciesGAV.[io.vertx:vertx-web]}}
import io.vertx.core.json.*;

import java.time.Instant;
import java.util.*;

import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.StaticHandler;
{{#if dependenciesGAV.[io.vertx:vertx-web-templ-handlebars]}}
import io.vertx.ext.web.templ.HandlebarsTemplateEngine;
{{/if}}
{{#if dependenciesGAV.[xyz.jetdrone:hot-reload]}}
import xyz.jetdrone.vertx.hot.reload.HotReload;
{{/if}}

import static java.time.temporal.ChronoUnit.DAYS;
{{/if}}

public class MainVerticle{{#unless metadata.graalNativeImage}} extends AbstractVerticle{{/unless}} {

  {{#if metadata.graalNativeImage}}
  public static void main(String[] args) {
    final Vertx vertx = Vertx.vertx();
    // your code goes here...
  }
  {{else}}
  @Override
  public void start() {
    // your code goes here...

    {{#if dependenciesGAV.[io.vertx:vertx-web]}}
    {{#if dependenciesGAV.[io.vertx:vertx-web-templ-handlebars]}}
    final HandlebarsTemplateEngine engine = HandlebarsTemplateEngine.create();
    {{/if}}
    final Router router = Router.router(vertx);

    {{#if dependenciesGAV.[xyz.jetdrone:hot-reload]}}
    // development hot reload
    router.get().handler(HotReload.create());
    {{/if}}

    router.get("/").handler(ctx -> {
      {{#if dependenciesGAV.[io.vertx:vertx-web-templ-handlebars]}}
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
      {{/if}}
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
    router.route().handler({{#if dependenciesGAV.[xyz.jetdrone:hot-reload]}}HotReload.createStaticHandler(){{else}}StaticHandler.create(){{/if}});
    {{/if}}

    vertx.createHttpServer().requestHandler({{#if dependenciesGAV.[io.vertx:vertx-web]}}router::accept{{else}}req -> {
      req.response()
        .putHeader("content-type", "text/plain")
        .end("Hello from Vert.x!");
    }{{/if}}).listen(8080, res -> {
      if (res.failed()) {
        res.cause().printStackTrace();
      } else {
        System.out.println("Server listening at: http://localhost:8080/");
      }
    });
  }
  {{/if}}
}
