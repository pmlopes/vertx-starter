package {{ metadata.package }};

import io.vertx.codegen.annotations.ProxyGen;
import io.vertx.codegen.annotations.VertxGen;
import io.vertx.core.Vertx;
import io.vertx.serviceproxy.ServiceProxyBuilder;

/**
 * {{ metadata.Service }} API.
 */
@VertxGen
@ProxyGen
public interface {{ metadata.Service }} {

  /**
   * The default service address.
   */
  String DEFAULT_ADDRESS = "{{ metadata.package }}.service";

  /**
    * Method called to create a proxy (to consume the service).
    *
    * @param vertx   vert.x
    * @param address the address on the event bus where the service is served.
    * @return the proxy
    */
  static {{ metadata.Service }} createProxy(Vertx vertx, String address) {
    return new ServiceProxyBuilder(vertx)
      .setAddress(address)
      .build({{ metadata.Service }}.class);
  }
}
