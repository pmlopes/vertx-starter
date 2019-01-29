package {{ metadata.package }};

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

import io.vertx.core.Handler;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;

import static java.time.temporal.ChronoUnit.DAYS;

public class WeatherAPI {

  // the example weather API
  private static final List<String> SUMMARIES = Arrays.asList(
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching");

  public static Handler<RoutingContext> get() {

    final Random rnd = new Random();

    return ctx -> {
      final JsonArray response = new JsonArray();
      final Instant now = Instant.now();

      for (int i = 1; i <= 5; i++) {
        JsonObject forecast = new JsonObject()
            .put("dateFormatted", now.plus(i, DAYS))
            .put("temperatureC", -20 + rnd.nextInt(35))
            .put("summary", SUMMARIES.get(rnd.nextInt(SUMMARIES.size())));

        forecast.put("temperatureF", 32 + (int) (forecast.getInteger("temperatureC") / 0.5556));

        response.add(forecast);
      }

      ctx.response().putHeader("Content-Type", "application/json").end(response.encode());
    };
  }
}
