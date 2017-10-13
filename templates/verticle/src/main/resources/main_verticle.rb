{{#if dependenciesGAV.[io.vertx:vertx-web]}}
require 'date'

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
SUMMARIES = ["Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"]

router.get("/api/weather-forecasts").handler() { |ctx|
  response = []
  now = Date.today

  i = 1
  while (i <= 5)
    now += 1
    forecast = {
      'dateFormatted' => now.strftime('%F'),
      'temperatureC' => -20 + rand(35),
      'summary' => SUMMARIES[rand(SUMMARIES.length)]
    }

    forecast['temperatureF'] = 32 + (forecast['temperatureC'] / 0.5556)

    response.push(forecast)
    i+=1
  end

  ctx.response().put_header("Content-Type", "application/json").end(JSON.generate(response))
}

# Serve the static resources
router.route().handler({{#if dependenciesGAV.[xyz.jetdrone:hot-reload]}}&Hotreload::HotReload.create_static_handler().method(:handle){{else}}&VertxWeb::StaticHandler.create().method(:handle){{/if}})
{{/if}}

http_server = $vertx.create_http_server()

http_server.request_handler({{#if dependenciesGAV.[io.vertx:vertx-web]}}&router.method(:accept)){{else}}) { |req|
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
