{{#if dependenciesGAV.[io.vertx:vertx-web]}}
require 'vertx-web/router'
require 'vertx-web/static_handler'
{{#if dependenciesGAV.[io.vertx:vertx-web-templ-handlebars]}}
require 'vertx-web/handlebars_template_engine'
{{/if}}
{{#if dependenciesGAV.[xyz.jetdrone:hot-reload]}}
require 'hotreload/hot_reload'
{{/if}}
{{/if}}

# your code goes here...

{{#if dependenciesGAV.[io.vertx:vertx-web]}}
{{#if dependenciesGAV.[io.vertx:vertx-web-templ-handlebars]}}
engine = VertxWeb::HandlebarsTemplateEngine.create()
{{/if}}
router = VertxWeb::Router.router($vertx)

{{#if dependenciesGAV.[xyz.jetdrone:hot-reload]}}
# development hot reload
router.get().handler(&Hotreload::HotReload.create().method(:handle))
{{/if}}

router.get("/").handler() { |ctx|
{{#if dependenciesGAV.[io.vertx:vertx-web-templ-handlebars]}}
  # we define a hardcoded title for our application
  ctx.put("title", "Home Page")
  ctx.put("hotreload", System.getenv("VERTX_HOT_RELOAD"))

  engine.render(ctx, "templates", "/index.hbs") { |res_err,res|
    if (res_err == nil)
      ctx.response().end(res)
    else
      ctx.fail(res_err)
    end
  }
{{else}}
  ctx.response()
    .putHeader("content-type", "text/plain")
    .end("Hello from Vert.x!")
{{/if}}
}

# the example weather API
router.get("/api/weather-forecasts").handler(&Java::TemplateApi::WeatherForecastAPI.new())
# Serve the static resources
router.route().handler({{#if dependenciesGAV.[xyz.jetdrone:hot-reload]}}&Hotreload::HotReload.create_static_handler().method(:handle){{else}}&StaticHandler::StaticHandler.create().method(:handle){{/if}})
{{/if}}

http_server = $vertx.create_http_server()

http_server.request_handler({{#if dependenciesGAV.[io.vertx:vertx-web]}}&router.method(:accept){{else}}) { |req|
  req.response()
    .putHeader("content-type", "text/plain")
    .end("Hello from Vert.x!")
}{{/if}}

http_server.listen(8080) { |res_err,res|
  if (res_err != nil)
    res_err.print_stack_trace()
  else
    puts "Server listening at: http://localhost:8080/"
  end
}
