package {{ metadata.packageName }};

import {{ metadata.packageName }}.impl.{{ metadata.Service }}Impl;

import io.vertx.core.AbstractVerticle;
import io.vertx.serviceproxy.ProxyHelper;

public class MainVerticle extends AbstractVerticle {

  private {{ metadata.Service }}Impl service;

  @Override
  public void start() throws Exception {
    service = new ServiceImpl(vertx, config());
    ProxyHelper.registerService({{ metadata.Service }}.class, vertx, service, "{{ metadata.packageName }}.service");
  }

  @Override
  public void stop() throws Exception {
    service.close();
  }
}
