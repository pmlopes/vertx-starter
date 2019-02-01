package {{ metadata.package }}

import io.vertx.lang.scala.ScalaVerticle
import io.vertx.scala.ext.web.Router

import scala.concurrent.Future

class MainVerticle extends ScalaVerticle {

  override def startFuture(): Future[_] = {
    // your code goes here...
    val router = Router.router(vertx)
        val route = router
          .get("/hello")
          .handler(_.response().end("world"))

        vertx
          .createHttpServer()
          .requestHandler(router.accept _)
          .listenFuture(8666, "0.0.0.0")
  }
}
