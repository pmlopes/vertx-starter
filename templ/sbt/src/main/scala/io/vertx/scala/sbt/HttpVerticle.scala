package io.vertx.scala.sbt

import io.vertx.lang.scala.ScalaVerticle
import io.vertx.scala.ext.web.Router

import scala.concurrent.{Future, Promise}
import scala.util.{Failure, Success}

class HttpVerticle extends ScalaVerticle {


  override def start(): Future[Unit] = {
    //Create a router to answer GET-requests to "/hello" with "world"
    val router = Router.router(vertx)
    val route = router
      .get("/hello")
        .handler(_.response().end("world"))

    vertx
      .createHttpServer()
      .requestHandler(router.accept)
      .listenFuture(8666, "0.0.0.0")
        .map(_ => ())
  }
}
