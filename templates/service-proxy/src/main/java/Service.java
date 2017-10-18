package {{ metadata.packageName }};

import io.vertx.codegen.annotations.ProxyGen;
import io.vertx.codegen.annotations.VertxGen;
import io.vertx.core.Vertx;
import io.vertx.serviceproxy.ProxyHelper;

/**
 * {{ metadata.Service }} API.
 */
@VertxGen
@ProxyGen
public interface {{ metadata.Service }} {
  /**
    * Method called to create a proxy (to consume the service).
    *
    * @param vertx   vert.x
    * @param address the address on the event bus where the service is served.
    * @return the proxy
    */
  static Service createProxy(Vertx vertx, String address) {
    return ProxyHelper.createProxy({{ metadata.Service }}.class, vertx, address);
  }
}
