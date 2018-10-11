package {{ package }};

import io.vertx.ext.web.client.HttpResponse;
import io.vertx.core.AsyncResult;
import io.vertx.ext.unit.Async;
import io.vertx.ext.unit.TestContext;
import io.vertx.ext.unit.junit.VertxUnitRunner;
import io.vertx.core.json.JsonObject;
import io.vertx.core.MultiMap;
import org.junit.*;
import org.junit.runner.RunWith;
import java.util.List;
import java.util.Map;

import {{ package }}.models.*;

/**
 * {{ operation.operationId }} Test
 */
@RunWith(VertxUnitRunner.class)
public class {{ operation.className }}Test extends BaseTest {

    @Override
    @Before
    public void before(TestContext context) {
        super.before(context);
        //TODO add some test initialization code like security token retrieval
    }

    @Override
    @After
    public void after(TestContext context) {
        //TODO add some test end code like session destroy
        super.after(context);
    }

{{#each operation.responses}}    @Test
    public void test{{capitalize @key}}(TestContext test) {
        Async async = test.async({{size @root.operation.functions}});
{{#each @root.operation.parsedParameters.path}}        {{solveOasType 'java' schema @root.modelsCache}} {{name}};
{{/each}}{{#each @root.operation.parsedParameters.cookie}}        {{solveOasType 'java' schema @root.modelsCache}} {{name}};
{{/each}}{{#each @root.operation.parsedParameters.query}}        {{solveOasType 'java' schema @root.modelsCache}} {{name}};
{{/each}}{{#each @root.operation.parsedParameters.header}}        {{solveOasType 'java' schema @root.modelsCache}} {{name}};
{{/each}}
{{#each @root.operation.functions}}

        // TODO set parameters for {{name}} request
{{#each @root.operation.parsedParameters.path}}        {{name}} = null;
{{/each}}{{#each @root.operation.parsedParameters.cookie}}        {{name}} = null;
{{/each}}{{#each @root.operation.parsedParameters.query}}        {{name}} = null;
{{/each}}{{#each @root.operation.parsedParameters.header}}        {{name}} = null;
{{/each}}{{#if json}}        {{solveOasType 'java' schema @root.modelsCache}} body = null;
{{else if form}}        MultiMap form = MultiMap.caseInsensitiveMultiMap();
{{else if stream}}        ReadStream<Buffer> stream = null;
{{else if buffer}}        Buffer buffer = null;
{{/if}}        apiClient.{{name}}({{#each @root.operation.parsedParameters.path}}{{name}}, {{/each}}{{#each @root.operation.parsedParameters.cookie}}{{name}}, {{/each}}{{#each @root.operation.parsedParameters.query}}{{name}}, {{/each}}{{#each @root.operation.parsedParameters.header}}{{name}}, {{/each}}{{#if json}}body, {{else if form}}form, {{else if stream}}stream, {{else if buffer}}buffer, {{/if}}(AsyncResult<HttpResponse> ar) -> {
            if (ar.succeeded()) {
                {{#if ../statusCode}}test.assertEquals({{../statusCode}}, ar.result().statusCode());{{/if}}
                //TODO add your asserts
            } else {
                test.fail("Request failed");
            }
            async.countDown();
        });
{{/each}}
    }

{{/each}}

}