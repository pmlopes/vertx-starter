package {{ package }}.services;

import io.vertx.core.Vertx;
import io.vertx.ext.unit.Async;
import io.vertx.ext.unit.TestContext;
import io.vertx.ext.unit.junit.RunTestOnContext;
import io.vertx.ext.unit.junit.VertxUnitRunner;
import io.vertx.ext.web.api.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.util.List;
import java.util.Map;

import {{ package }}.models.*;

/**
 * {{ serviceName }} Test
 */
@RunWith(VertxUnitRunner.class)
public class {{ serviceName }}Test {

  @Rule
  public RunTestOnContext rule = new RunTestOnContext();

  {{ serviceName }} {{toVariableName serviceName}};

  @Before
  public void before(TestContext context) {
    Vertx vertx = rule.vertx();
    {{toVariableName serviceName}} = {{ serviceName }}.create(vertx);
    //TODO add some test initialization code like security token retrieval
  }

  @After
  public void after(TestContext context) {
    //TODO add some test end code like session destroy
  }

{{#each operations}}  @Test
  public void {{operationId}}Test(TestContext context) {
    Async async = context.async({{size responses}});
{{#each parsedParameters.path}}    {{solveOasTypeForService 'java' schema @root.modelsCache}} {{sanitizedName}};
{{/each}}{{#each parsedParameters.cookie}}    {{solveOasTypeForService 'java' schema @root.modelsCache}} {{sanitizedName}};
{{/each}}{{#each parsedParameters.query}}    {{solveOasTypeForService 'java' schema @root.modelsCache}} {{sanitizedName}};
{{/each}}{{#each parsedParameters.header}}    {{solveOasTypeForService 'java' schema @root.modelsCache}} {{sanitizedName}};
{{/each}}{{#if bodySchema}}    {{solveOasTypeForService 'java' bodySchema @root.modelsCache}} body;
{{/if}}
{{#each responses}}

    // TODO set parameters for {{@key}} response test
{{#each ../parsedParameters.path}}    {{sanitizedName}} = null;
{{/each}}{{#each ../parsedParameters.cookie}}    {{sanitizedName}} = null;
{{/each}}{{#each ../parsedParameters.query}}    {{sanitizedName}} = null;
{{/each}}{{#each ../parsedParameters.header}}    {{sanitizedName}} = null;
{{/each}}{{#if ../bodySchema}}    body = null;
{{/if}}    {{toVariableName @root.serviceName}}.{{../serviceMethodName}}({{#each ../parsedParameters.path}}{{sanitizedName}}, {{/each}}{{#each ../parsedParameters.cookie}}{{sanitizedName}}, {{/each}}{{#each ../parsedParameters.query}}{{sanitizedName}}, {{/each}}{{#each ../parsedParameters.header}}{{sanitizedName}}, {{/each}}{{#if ../bodySchema}}body, {{/if}}new OperationRequest(), ar -> {
      if (ar.succeeded()) {
        OperationResponse result = ar.result();
        context.assertEquals({{@key}}, result.getStatusCode());
        //TODO add your asserts
      } else {
        context.fail("Operation failed with " + ar.cause().toString());
      }
      async.countDown();
    });
{{/each}}
  }

{{/each}}

}