{{#containsDep dependencies "io.vertx" "vertx-web"}}
import io.vertx.ext.web.Router
{{/containsDep}}

// your code goes here...

{{#containsDep dependencies "io.vertx" "vertx-web"}}
def router = Router.router(vertx)

router.get("/").handler({ ctx ->
  ctx.response()
    .putHeader("content-type", "text/plain")
    .end("Hello from Vert.x!")
})
{{/containsDep}}

vertx.createHttpServer().requestHandler({{#containsDep dependencies "io.vertx" "vertx-web"}}router{{else}}{ req ->
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
