package {{ metadata.packageName }}

import io.vertx.core.AbstractVerticle

{{#if dependenciesGAV.[io.vertx:vertx-web]}}
import java.time.Instant
import java.time.temporal.ChronoUnit.DAYS
import java.util.*

import io.vertx.kotlin.core.json.array
import io.vertx.kotlin.core.json.json
import io.vertx.kotlin.core.json.obj

import io.vertx.ext.web.Router
import io.vertx.ext.web.handler.StaticHandler
{{#if dependenciesGAV.[io.vertx:vertx-web-templ-handlebars]}}
import io.vertx.ext.web.templ.HandlebarsTemplateEngine
{{/if}}
{{#if dependenciesGAV.[xyz.jetdrone:hot-reload]}}
import xyz.jetdrone.vertx.hot.reload.HotReload
{{/if}}
{{/if}}

class MainVerticle : AbstractVerticle() {

  override fun start() {
    // your code goes here...

    {{#if dependenciesGAV.[io.vertx:vertx-web]}}
    {{#if dependenciesGAV.[io.vertx:vertx-web-templ-handlebars]}}
    var engine = HandlebarsTemplateEngine.create()
    {{/if}}
    var router = Router.router(vertx)

    {{#if dependenciesGAV.[xyz.jetdrone:hot-reload]}}
    // development hot reload
    router.get().handler(HotReload.create())
    {{/if}}

    router.get("/").handler({ ctx ->
      {{#if dependenciesGAV.[io.vertx:vertx-web-templ-handlebars]}}
      // we define a hardcoded title for our application
      ctx.put("title", "Home Page")
      ctx.put("hotreload", System.getenv("VERTX_HOT_RELOAD"))

      engine.render(ctx, "templates", "/index.hbs", { res ->
        if (res.succeeded()) {
          ctx.response().end(res.result())
        } else {
          ctx.fail(res.cause())
        }
      })
      {{else}}
      ctx.response()
        .putHeader("content-type", "text/plain")
        .end("Hello from Vert.x!")
      {{/if}}
    })

    // the example weather API
    var SUMMARIES = listOf("Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching")

    router.get("/api/weather-forecasts").handler({ ctx ->
      var response = json {
        array()
      }

      var now = Instant.now()
      var rnd = Random()

      for (i in 1..5) {
        var forecast = json {
          obj(
            "dateFormatted" to now.plus(i.toLong(), DAYS),
            "temperatureC" to -20 + rnd.nextInt(35),
            "summary" to SUMMARIES[rnd.nextInt(SUMMARIES.size)]
          )
        }

        forecast.put("temperatureF", 32 + (forecast.getInteger("temperatureC") / 0.5556))

        response.add(forecast)
      }

      ctx.response()
        .putHeader("Content-Type", "application/json")
        .end(response.toString())
    })

    // Serve the static resources
    router.route().handler({{#if dependenciesGAV.[xyz.jetdrone:hot-reload]}}HotReload.createStaticHandler(){{else}}StaticHandler.create(){{/if}})
    {{/if}}

    vertx.createHttpServer().requestHandler({{#if dependenciesGAV.[io.vertx:vertx-web]}}router::accept{{else}}{ req ->
      req.response()
        .putHeader("content-type", "text/plain")
        .end("Hello from Vert.x!")
    }{{/if}}).listen(8080, { res ->
      if (res.failed()) {
        res.cause().printStackTrace()
      } else {
        System.out.println("Server listening at: http://localhost:8080/")
      }
    })
  }
}
