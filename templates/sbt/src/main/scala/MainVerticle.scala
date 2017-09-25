package {{ metadata.packageName }}

import io.vertx.lang.scala.ScalaVerticle

class MainVerticle extends ScalaVerticle {

  override def start(): Unit = {
    // your code goes here...
    vertx
      .createHttpServer()
      .requestHandler(_.response()
        .putHeader("content-type", "text/plain")
        .end("Hello from Vert.x!"))
      .listenFuture(8080, "0.0.0.0")
        .map(_ => ())
  }
}
