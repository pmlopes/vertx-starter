package {{ metadata.packageName }}

import io.vertx.lang.scala.ScalaVerticle

import scala.concurrent.Promise
import scala.util.{ Failure, Success }

class TestVerticle extends ScalaVerticle {
  override def start(startPromise: Promise[Unit]): Unit = {
    vertx
      .eventBus()
      .consumer[String]("testAddress")
      .handler(_.reply("Hello World!"))
      .completionFuture()
      .andThen {
        case Success(_) => startPromise.success(())
        case Failure(t) => startPromise.failure(t)
      }
  }
}
