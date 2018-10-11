package {{ metadata.package }};

import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.VertxOptions;
import io.vertx.ext.unit.Async;
import io.vertx.ext.unit.TestContext;
import io.vertx.ext.unit.junit.RunTestOnContext;

public class BaseTest {

    Vertx vertx;
    String deploymentId;
    ApiClient apiClient;

    public void before(TestContext context) {
        vertx = Vertx.vertx(new VertxOptions().setMaxEventLoopExecuteTime(Long.MAX_VALUE));
        Async async = context.async();
        vertx.deployVerticle(MainVerticle.class.getName(), res -> {
            if (res.succeeded()) {
                deploymentId = res.result();
                apiClient = new ApiClient(vertx, "localhost", 8080);
                async.complete();
            } else {
                context.fail("Verticle deployment failed!");
                async.complete();
            }
        });
    }

    public void after(TestContext context) {
        apiClient.close();
        vertx.close(context.asyncAssertSuccess());
    }
}
