{{#if dependenciesGAV.[io.vertx:vertx-web]}}
import io.vertx.ext.web.Router
import io.vertx.ext.web.handler.StaticHandler
{{#if dependenciesGAV.[io.vertx:vertx-web-templ-handlebars]}}
import io.vertx.ext.web.templ.HandlebarsTemplateEngine
{{/if}}
{{#if dependenciesGAV.[xyz.jetdrone:hot-reload]}}
import xyz.jetdrone.vertx.hot.reload.HotReload
{{/if}}
import {{ metadata.packageName }}.api.WeatherForecastAPI
{{/if}}

// your code goes here...

{{#if dependenciesGAV.[io.vertx:vertx-web]}}
{{#if dependenciesGAV.[io.vertx:vertx-web-templ-handlebars]}}
def engine = HandlebarsTemplateEngine.create()
{{/if}}
def router = Router.router(vertx)

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
router.get("/api/weather-forecasts").handler(new WeatherForecastAPI())
// Serve the static resources
router.route().handler({{#if dependenciesGAV.[xyz.jetdrone:hot-reload]}}HotReload.createStaticHandler(){{else}}StaticHandler.create(){{/if}})
{{/if}}

vertx.createHttpServer().requestHandler({{#if dependenciesGAV.[io.vertx:vertx-web]}}router.&accept{{else}}{ req ->
  req.response()
    .putHeader("content-type", "text/plain")
    .end("Hello from Vert.x!")
}{{/if}}).listen(8080, { res ->
  if (res.failed()) {
    res.cause().printStackTrace()
  } else {
    println("Server listening at: http://localhost:8080/")
  }
})
