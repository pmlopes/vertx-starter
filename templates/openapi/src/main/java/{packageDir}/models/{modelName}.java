{{#*inline "getFnName"}}{{#if (eq type 'boolean')}}is{{else}}get{{/if}}{{capitalize (toVariableName name)}}{{/inline}}package {{package}}.models;

import io.vertx.codegen.annotations.DataObject;
import io.vertx.codegen.annotations.Fluent;
import io.vertx.core.json.JsonObject;
import java.util.List;
import java.util.Map;

@DataObject(generateConverter = true, publicConverter = false)
public class {{modelName}} {

{{#each schema.properties}}  private {{solveOasType 'java' . ../modelsCache}} {{toVariableName @key}};
{{/each}}

  public {{modelName}} (
{{#each schema.properties}}    {{solveOasType 'java' . ../modelsCache}} {{toVariableName @key}}{{#unless @last}},{{/unless}}
{{/each}}  ) {
{{#each schema.properties}}    this.{{toVariableName @key}} = {{toVariableName @key}};
{{/each}}  }

  public {{modelName}}(JsonObject json) {
    {{modelName}}Converter.fromJson(json, this);
  }

  public {{modelName}}({{modelName}} other) {
{{#each schema.properties}}    this.{{toVariableName @key}} = other.{{> getFnName name=@key type=type}}();
{{/each}}  }

  public JsonObject toJson() {
    JsonObject json = new JsonObject();
    {{modelName}}Converter.toJson(this, json);
    return json;
  }

{{#each schema.properties}}  @Fluent public {{../modelName}} set{{capitalize (toVariableName @key)}}({{solveOasType 'java' . ../modelsCache}} {{toVariableName @key}}){
    this.{{toVariableName @key}} = {{toVariableName @key}};
    return this;
  }
  public {{solveOasType 'java' . ../modelsCache}} {{> getFnName name=@key type=type}}() {
    return this.{{toVariableName @key}};
  }

{{/each}}
}