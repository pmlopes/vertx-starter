package {{ metadata.packageName }};

import {{ metadata.packageName }}.impl.ServiceImpl;

import io.vertx.core.AbstractVerticle;
import io.vertx.serviceproxy.ProxyHelper;

public class MainVerticle extends AbstractVerticle {

  private ServiceImpl service;

  @Override
  public void start() throws Exception {
    service = new ServiceImpl(vertx, config());
    ProxyHelper.registerService(Service.class, vertx, service, "{{ metadata.packageName }}.service");
  }

  @Override
  public void stop() throws Exception {
    service.close();
  }
}
