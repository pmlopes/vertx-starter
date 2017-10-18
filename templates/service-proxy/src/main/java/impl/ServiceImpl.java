package {{metadata.packageName}}.impl;

import {{metadata.packageName}}.{{ metadata.Service }};

import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;

public class {{ metadata.Service }}Impl implements {{ metadata.Service }} {

  public ServiceImpl(Vertx vertx, JsonObject config) {
    // initialization...
  }

  // Implement your service here...

  public void close() {
    // clean up...
  }
}
