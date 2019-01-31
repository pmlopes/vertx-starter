{{#containsDep dependencies "io.vertx" "vertx-web"}}
var Router = require("vertx-web-js/router");
{{/containsDep}}

// your code goes here...

{{#containsDep dependencies "io.vertx" "vertx-web"}}
var router = Router.router(vertx);

router.get("/").handler(function (ctx) {
  ctx.response()
    .putHeader("content-type", "text/plain")
    .end("Hello from Vert.x!");
});
{{/containsDep}}

vertx.createHttpServer().requestHandler({{#containsDep dependencies "io.vertx" "vertx-web"}}router{{else}}function (req) {
  req.response()
    .putHeader("content-type", "text/plain")
    .end("Hello from Vert.x!")
}{{/containsDep}}).listen(8080, function (res, res_err) {
  if (res_err != null) {
    res_err.printStackTrace();
  } else {
    console.log("Server listening at: http://localhost:8080/");
  }
});
