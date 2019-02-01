package {{ metadata.package }}

import org.scalatest.Matchers

import scala.concurrent.Promise

class MainVerticleSpec extends VerticleTesting[MainVerticle] with Matchers {

  "MainVerticle" should "bind to 8666 and answer with 'world'" in {
    val promise = Promise[String]

    vertx.createHttpClient()
      .getNow(8666, "127.0.0.1", "/hello",
        r => {
          r.exceptionHandler(promise.failure)
          r.bodyHandler(b => promise.success(b.toString))
        })

    promise.future.map(res => res should equal("world"))
  }

}
