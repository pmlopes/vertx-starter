package {{ metadata.package }};

{{#if metadata.graalNativeImage}}
import io.vertx.core.Vertx;
{{/if}}
import io.vertx.core.AbstractVerticle;
{{#containsDep dependencies "io.vertx" "vertx-web"}}
import io.vertx.ext.web.Router;
{{/containsDep}}

public class MainVerticle extends AbstractVerticle {

  {{#if metadata.graalNativeImage}}
  public static void main(String[] args) {
    // TODO: configure your vertx options here
    Vertx.vertx().deployVerticle(new MainVerticle());
  }
  {{/if}}

  @Override
  public void start() {
    // your code goes here...
    {{#containsDep dependencies "io.vertx" "vertx-web"}}
    final Router router = Router.router(vertx);

    router.get("/").handler(ctx -> {
      ctx.response()
        .putHeader("content-type", "text/plain")
        .end("Hello from Vert.x!");
    });
    {{/containsDep}}

    vertx.createHttpServer().requestHandler({{#containsDep dependencies "io.vertx" "vertx-web"}}router{{else}}req -> {
      req.response()
        .putHeader("content-type", "text/plain")
        .end("Hello from Vert.x!");
    }{{/containsDep}}).listen(8080, res -> {
      if (res.failed()) {
        res.cause().printStackTrace();
      } else {
        System.out.println("Server listening at: http://localhost:8080/");
      }
    });
  }
}
