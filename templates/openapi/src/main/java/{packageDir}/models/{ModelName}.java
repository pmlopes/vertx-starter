{{#*inline "getFnName"}}{{#if (eq type 'boolean')}}is{{else}}get{{/if}}{{firstUppercase (sanitizeOasParameterName name)}}{{/inline}}
package {{package}};

import io.vertx.codegen.annotations.DataObject;
import io.vertx.codegen.annotations.Fluent;
import io.vertx.core.json.JsonObject;
import java.util.List;
import java.util.Map;

@DataObject(generateConverter = true, publicConverter = false)
public class {{modelName}} {

{{#each schema.properties}}    final {{solveOasType 'java' modelType type format}} {{sanitizeOasParameterName @key}};
{{/each}}

    public {{modelName}} (
{{#each schema.properties}}        {{solveOasType 'java' modelType type format}} {{sanitizeOasParameterName @key}}{{#unless @last}},{{/unless}}
{{/each}}    ) {
{{#each schema.properties}}        this.{{sanitizeOasParameterName @key}} = {{sanitizeOasParameterName @key}};
{{/each}}    }

  public {{modelName}}(JsonObject json) {
    {{modelName}}Converter.fromJson(json, this);
    }

  public {{modelName}}({{modelName}} other) {
{{#each schema.properties}}    this.{{sanitizeOasParameterName @key}} = other.{{> getFnName name=@key type=type}}();
{{/each}}    }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    {{modelName}}Converter.toJson(this, json);
    return json;
  }

{{#each schema.properties}}    @Fluent {{../modelName}} set{{firstUppercase (sanitizeOasParameterName @key)}}({{solveOasType 'java' modelType type format}} {{sanitizeOasParameterName @key}}){
        this.{{sanitizeOasParameterName @key}} = {{sanitizeOasParameterName @key}};
        return this;
    }
    {{solveOasType 'java' modelType type format}} {{> getFnName name=@key type=type}}() {
        return this.{{sanitizeOasParameterName @key}};
    }

{{/each}}
}