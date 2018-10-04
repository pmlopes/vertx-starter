package {{metadata.package}}.impl;

import {{metadata.package}}.{{ metadata.Service }};

import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;

public class {{ metadata.Service }}Impl implements {{ metadata.Service }} {

  public {{ metadata.Service }}Impl(Vertx vertx, JsonObject config) {
    // initialization...
  }

  // TODO: Implement your service here...

  public void close() {
    // clean up...
  }
}
