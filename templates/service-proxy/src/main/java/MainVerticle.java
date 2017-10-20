package {{ metadata.packageName }};

import {{ metadata.packageName }}.impl.{{ metadata.Service }}Impl;

import io.vertx.core.AbstractVerticle;
import io.vertx.serviceproxy.ServiceBinder;

public class MainVerticle extends AbstractVerticle {

  private {{ metadata.Service }}Impl service;

  @Override
  public void start() throws Exception {
    service = new {{ metadata.Service }}Impl(vertx, config());
    new ServiceBinder(vertx)
      .setAddress({{ metadata.Service }}.DEFAULT_ADDRESS)
      .register({{ metadata.Service }}.class, service);
  }

  @Override
  public void stop() throws Exception {
    service.close();
  }
}
