package {{ metadata.package }}

import io.vertx.core.AbstractVerticle
import io.vertx.ext.web.Router
import io.vertx.ext.web.handler.ErrorHandler
import io.vertx.ext.web.handler.FaviconHandler
import io.vertx.ext.web.handler.StaticHandler
import xyz.jetdrone.vertx.spa.services.SPA

class MainVerticle : AbstractVerticle() {

  override fun start() {
    // your code goes here...
    val router = Router.router(vertx).apply {
      // Favicon
      route().handler(FaviconHandler.create("favicon.ico"))
      // mount the weather API
      get("/api/weather-forecast")
        .handler(WeatherAPI.get())
        .failureHandler(ErrorHandler.create("error-template.html"))
      // will redirect to ng-serve while in development time
      route().handler(SPA.serve("{{metadata.clientapp}}", 8081))
      // Serve the static resources
      route().handler(StaticHandler.create())
    }
    vertx.createHttpServer().requestHandler(router).listen(8080) { res ->
      if (res.failed()) {
        res.cause().printStackTrace()
      } else {
        println("Server listening at: http://localhost:8080/")
      }
    }
  }

  override fun stop() {
    // will stop any SPA running processes
    SPA.stop()
  }
}
