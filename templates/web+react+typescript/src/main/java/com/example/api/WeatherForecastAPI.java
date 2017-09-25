package com.example.api;

import io.vertx.core.Handler;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

import static java.time.temporal.ChronoUnit.DAYS;

public class WeatherForecastAPI implements Handler<RoutingContext> {

    private static final List<String> SUMMARIES = Arrays.asList("Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching");
    private Random rnd = new Random();

    @Override
    public void handle(RoutingContext ctx) {

        final JsonArray response = new JsonArray();

        for (int i = 1; i <= 5; i++) {
            JsonObject forecast = new JsonObject()
                    .put("dateFormatted", Instant.now().plus(i, DAYS))
                    .put("temperatureC", -20 + rnd.nextInt(35))
                    .put("summary", SUMMARIES.get(rnd.nextInt(SUMMARIES.size())));

            forecast.put("temperatureF", 32 + (int) (forecast.getInteger("temperatureC") / 0.5556));

            response.add(forecast);
        }

        ctx.response()
                .putHeader("Content-Type", "application/json")
                .end(response.encode());
    }
}
