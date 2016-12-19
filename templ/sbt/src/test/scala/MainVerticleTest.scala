package {{ metadata.packageName }}

import io.vertx.lang.scala.VertxExecutionContext
import io.vertx.scala.core.Vertx
import org.scalatest._

import scala.concurrent.{Await, Promise}
import scala.concurrent.duration._
import scala.util.{Failure, Success}

class MainVerticleTest extends FunSuite {
  val vertx = Vertx.vertx
  implicit val vertxExecutionContext = VertxExecutionContext(
    vertx.getOrCreateContext()
  )

  Await.result(
    vertx
      .deployVerticleFuture("scala:" + classOf[DemoVerticle].getName)
      .andThen {
        case Success(d) => d
        case Failure(t) => throw new RuntimeException(t)
      },
    1000 millis
  )

  test("DemoVerticle should bind to 8666 and answer with 'world'") {
    val promise = Promise[String]
    vertx.createHttpClient()
        .getNow(8666, "127.0.0.1", "/hello", r => r.bodyHandler(body => promise.complete(Success(body.toString()))))
    promise.future.map(res => assert(res == "hello"))
  }

}
