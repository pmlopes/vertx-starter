package {{ metadata.packageName }};

import io.vertx.codegen.annotations.ProxyGen;
import io.vertx.codegen.annotations.VertxGen;
import io.vertx.core.Vertx;
import io.vertx.serviceproxy.ProxyHelper;

/**
 * Service exposed on the event bus.
 */
@VertxGen
@ProxyGen
public interface Service {
  /**
    * Method called to create a proxy (to consume the service).
    *
    * @param vertx   vert.x
    * @param address the address on the vent bus where the service is served.
    * @return the proxy
    */
  static Service createProxy(Vertx vertx, String address) {
    return ProxyHelper.createProxy(Service.class, vertx, address);
  }
}
