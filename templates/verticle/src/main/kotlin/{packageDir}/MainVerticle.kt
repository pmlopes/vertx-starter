package {{ metadata.package }}

import io.vertx.core.AbstractVerticle

{{#containsDep dependencies "io.vertx" "vertx-web"}}
import io.vertx.ext.web.Router
{{/containsDep}}

class MainVerticle : AbstractVerticle() {

  override fun start() {
    // your code goes here...
    {{#containsDep dependencies "io.vertx" "vertx-web"}}
    var router = Router.router(vertx).apply {
      get("/").handler({ ctx ->
        ctx.response()
          .putHeader("content-type", "text/plain")
          .end("Hello from Vert.x!")
      })
    }
    {{/containsDep}}

    vertx.createHttpServer().requestHandler({{#containsDep dependencies "io.vertx" "vertx-web"}}router{{else}}{ req ->
      req.response()
        .putHeader("content-type", "text/plain")
        .end("Hello from Vert.x!")
    }{{/containsDep}}).listen(8080, { res ->
      if (res.failed()) {
        res.cause().printStackTrace()
      } else {
        System.out.println("Server listening at: http://localhost:8080/")
      }
    })
  }
}
