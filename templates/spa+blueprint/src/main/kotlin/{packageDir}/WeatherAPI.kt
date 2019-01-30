package {{ metadata.package }}

import java.time.Instant
import java.util.Random

import io.vertx.core.json.JsonArray
import io.vertx.ext.web.RoutingContext
import io.vertx.kotlin.core.json.json
import io.vertx.kotlin.core.json.obj

import java.time.temporal.ChronoUnit.DAYS

object WeatherAPI {

  // the example weather API
  private val SUMMARIES = listOf(
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching")

  fun get(): (RoutingContext) -> Unit {

    val rnd = Random()

    return { ctx ->
      val response = JsonArray()
      val now = Instant.now()

      for (i in 1..5) {
        val forecast = json {
          obj(
            "dateFormatted" to now.plus(i.toLong(), DAYS),
            "temperatureC" to -20 + rnd.nextInt(35),
            "summary" to SUMMARIES[rnd.nextInt(SUMMARIES.size)]
          )
        }

        forecast.put("temperatureF", 32 + (forecast.getInteger("temperatureC")!! / 0.5556).toInt())

        response.add(forecast)
      }

      ctx.response().putHeader("Content-Type", "application/json").end(response.encode())
    }
  }
}
