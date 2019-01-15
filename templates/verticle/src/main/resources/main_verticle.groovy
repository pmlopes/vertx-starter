{{#containsDep dependencies "io.vertx" "vertx-web"}}
import java.time.Instant

import io.vertx.ext.web.Router
import io.vertx.ext.web.handler.StaticHandler
{{#containsDep dependencies "io.vertx" "vertx-web-templ-handlebars"}}
import io.vertx.ext.web.templ.HandlebarsTemplateEngine
{{/containsDep}}
{{#containsDep dependencies "xyz.jetdrone" "hot-reload"}}
import xyz.jetdrone.vertx.hot.reload.HotReload
{{/containsDep}}

import static java.time.temporal.ChronoUnit.DAYS
{{/containsDep}}

// your code goes here...

{{#containsDep dependencies "io.vertx" "vertx-web"}}
{{#containsDep dependencies "io.vertx" "vertx-web-templ-handlebars"}}
def engine = HandlebarsTemplateEngine.create()
{{/containsDep}}
def router = Router.router(vertx)

{{#containsDep dependencies "xyz.jetdrone" "hot-reload"}}
// development hot reload
router.get().handler(HotReload.create())
{{/containsDep}}

router.get("/").handler({ ctx ->
{{#containsDep dependencies "io.vertx" "vertx-web-templ-handlebars"}}
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
{{/containsDep}}
})

// the example weather API
def SUMMARIES = ["Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"]

router.get("/api/weather-forecasts").handler({ ctx ->
  def response = [
  ]
  def now = Instant.now()

  for (def i = 1; i <= 5; i++) {
    def forecast = [
      dateFormatted: now.plus(i, DAYS) as String,
      temperatureC: -20 + Math.random() * 35,
      summary: SUMMARIES[Math.random() * SUMMARIES.size() as int]
    ]

    forecast.temperatureF = 32 + (forecast.temperatureC / 0.5556d)

    response.add(forecast)
  }

  ctx.response()
    .putHeader("Content-Type", "application/json")
    .end(groovy.json.JsonOutput.toJson(response))
})

// Serve the static resources
router.route().handler({{#containsDep dependencies "xyz.jetdrone" "hot-reload"}}HotReload.createStaticHandler(){{else}}StaticHandler.create(){{/containsDep}})
{{/containsDep}}

vertx.createHttpServer().requestHandler({{#containsDep dependencies "io.vertx" "vertx-web"}}router.&accept{{else}}{ req ->
  req.response()
    .putHeader("content-type", "text/plain")
    .end("Hello from Vert.x!")
}{{/containsDep}}).listen(8080, { res ->
  if (res.failed()) {
    res.cause().printStackTrace()
  } else {
    println("Server listening at: http://localhost:8080/")
  }
})
