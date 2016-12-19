package {{ metadata.packageName }}

import io.vertx.lang.scala.ScalaVerticle
import io.vertx.scala.ext.web.Router
import io.vertx.scala.ext.web.handler.StaticHandler

import scala.concurrent.Promise
import scala.util.{Failure, Success}

class MainVerticle extends ScalaVerticle {


  override def start(startPromise: Promise[Unit]): Unit = {

    val router = Router.router(vertx)
    router.route("/static/*").handler(StaticHandler.create())
    router.get("/hello").handler(_.response().end("world"))

    vertx
      .createHttpServer()
      .requestHandler(router.accept _)
      .listenFuture(8666)
      .andThen{
        case Success(_) => startPromise.success()
        case Failure(t) => startPromise.failure(t)
      }

  }
}
