{{#if dependenciesGAV.[io.vertx:vertx-web]}}
var Router = require("vertx-web-js/router");
var StaticHandler = require("vertx-web-js/static_handler");
{{#if dependenciesGAV.[io.vertx:vertx-web-templ-handlebars]}}
var HandlebarsTemplateEngine = require("vertx-web-js/handlebars_template_engine");
{{/if}}
{{#if dependenciesGAV.[xyz.jetdrone:hot-reload]}}
var HotReload = require("hotreload-js/hot_reload");
{{/if}}
{{/if}}

// your code goes here...

{{#if dependenciesGAV.[io.vertx:vertx-web]}}
{{#if dependenciesGAV.[io.vertx:vertx-web-templ-handlebars]}}
var engine = HandlebarsTemplateEngine.create();
{{/if}}
var router = Router.router(vertx);

{{#if dependenciesGAV.[xyz.jetdrone:hot-reload]}}
// development hot reload
router.get().handler(HotReload.create().handle);
{{/if}}

router.get("/").handler(function (ctx) {
{{#if dependenciesGAV.[io.vertx:vertx-web-templ-handlebars]}}
  // we define a hardcoded title for our application
  ctx.put("title", "Home Page");
  ctx.put("hotreload", process.env["VERTX_HOT_RELOAD"]);

  engine.render(ctx, "templates", "/index.hbs", function (res, res_err) {
    if (res_err == null) {
      ctx.response().end(res);
    } else {
      ctx.fail(res_err);
    }
  });
{{else}}
  ctx.response()
    .putHeader("content-type", "text/plain")
    .end("Hello from Vert.x!");
{{/if}}
});

// the example weather API
var SUMMARIES = ["Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"];
var rnd = new (Java.type("java.util.Random"))();

router.get("/api/weather-forecasts").handler(function (ctx) {
  var response = [];

  var now = new Date();

  for (var i = 1; i <= 5; i++) {
    now.setDate(now.getDate() + 1);
    var forecast = {
      "dateFormatted" : now.toISOString(),
      "temperatureC" : -20 + Math.random() * 35,
      "summary" : SUMMARIES[Math.random() * SUMMARIES.length]
    };

    forecast.temperatureF = 32 + (forecast.temperatureC / 0.5556);

    response.push(forecast);
  }

  ctx.response()
    .putHeader("Content-Type", "application/json")
    .end(JSON.stringify(response));
});

// Serve the static resources
router.route().handler({{#if dependenciesGAV.[xyz.jetdrone:hot-reload]}}HotReload.createStaticHandler().handle{{else}}StaticHandler.create().handle{{/if}});
{{/if}}
vertx.createHttpServer().requestHandler({{#if dependenciesGAV.[io.vertx:vertx-web]}}router.accept{{else}}function (req) {
  req.response()
    .putHeader("content-type", "text/plain")
    .end("Hello from Vert.x!")
}{{/if}}).listen(8080, function (res, res_err) {
  if (res_err != null) {
    res_err.printStackTrace();
  } else {
    console.log("Server listening at: http://localhost:8080/");
  }
});
