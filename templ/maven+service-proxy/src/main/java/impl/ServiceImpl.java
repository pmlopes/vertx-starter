package {{metadata.packageName}}.impl;

import {{metadata.packageName}}.Service;

import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;

public class ServiceImpl implements Service {

  public ServiceImpl(Vertx vertx, JsonObject config) {
    // initialization...
  }

  // Implement your service here...

  public void close() {
    // clean up...
  }
}
