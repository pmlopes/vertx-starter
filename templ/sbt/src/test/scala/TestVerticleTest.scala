package {{ metadata.packageName }}

import io.vertx.lang.scala.VertxExecutionContext
import io.vertx.scala.core.Vertx
import org.scalatest._

import scala.concurrent.Await
import scala.concurrent.duration._
import scala.util.{Failure, Success}

class TestVerticleTest extends AsyncFunSuite {
  val vertx = Vertx.vertx
  implicit val vertxExecutionContext = VertxExecutionContext(
    vertx.getOrCreateContext()
  )

  Await.result(
    vertx
      .deployVerticleFuture("scala:" + classOf[TestVerticle].getName)
      .andThen {
        case Success(d) => d
        case Failure(t) => throw new RuntimeException(t)
      },
    10 millis
  )

  test("TestVerticle should reply to a message") {
    vertx
      .eventBus()
      .sendFuture[String]("testAddress", "msg")
      .map(res => assert(res.body() == "Hello World!"))
  }

}
