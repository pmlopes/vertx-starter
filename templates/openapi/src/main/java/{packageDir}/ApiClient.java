package {{ package }};

import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.MultiMap;
import io.vertx.core.Vertx;
import io.vertx.core.buffer.Buffer;
import io.vertx.core.json.JsonObject;
import io.vertx.core.json.JsonArray;
import io.vertx.core.streams.ReadStream;
import io.vertx.ext.web.client.HttpRequest;
import io.vertx.ext.web.client.HttpResponse;
import io.vertx.ext.web.client.WebClient;
import io.vertx.ext.web.client.WebClientOptions;

import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Base64;

import {{ package }}.models.*;

public class ApiClient {
    private WebClient client;
    private int port;
    private String host;

{{#if openapiSpec.components.securitySchemes}}{{#each openapiSpec.components.securitySchemes}}{{#and (eq type 'http') (eq scheme 'basic')}}
    private String {{toVariableName @key}}_username;
    private String {{toVariableName @key}}_password;
    {{/and}}{{#or (and (eq type 'http') (eq scheme 'bearer')) (eq type 'apiKey') (eq type 'oauth2') (eq type 'openIdConnect')}}
    private String {{toVariableName @key}}_token;
    {{/or}}{{/each}}

{{/if}}    private MultiMap cookieParams;

    ApiClient(Vertx vertx, String host, int port) {
        client = WebClient.create(vertx, new WebClientOptions().setDefaultHost(host).setDefaultPort(port));
        this.port = port;
        this.host = host;

        cookieParams = MultiMap.caseInsensitiveMultiMap();
    }

    ApiClient(WebClient client) {
        this.client = client;

        cookieParams = MultiMap.caseInsensitiveMultiMap();
    }

    {{#each operations}}
    {{#each functions}}
    /**
     * Call {{ ../operationId }} with {{#if json}}Json body{{else if form}}form {{contentType}} body{{else if stream}}{{contentType}} stream body{{else if buffer}}{{contentType}} buffer body{{else}}empty body{{/if}}. {{#if ../description}}
     * {{description}}{{/if}}
{{#each ../parsedParameters.path}}     * @param {{sanitizedName}} Parameter {{name}} inside path
{{/each}}{{#each ../parsedParameters.cookie}}     * @param {{sanitizedName}} Parameter {{name}} inside cookie
{{/each}}{{#each ../parsedParameters.query}}     * @param {{sanitizedName}} Parameter {{name}} inside query
{{/each}}{{#each ../parsedParameters.header}}     * @param {{sanitizedName}} Parameter {{name}} inside header
{{/each}}{{#if json}}     * @param body {{type}} that represents the body of the request
{{else if form}}     * @param form Form that represents the body of the request
{{else if stream}}     * @param stream ReadStream that represents the body of the request
{{else if buffer}}     * @param buffer Buffer that represents the body of the request
{{/if}}
     * @param handler The handler for the asynchronous request
     */
    public void {{name}}(
{{#each ../parsedParameters.path}}        {{solveOasType 'java' schema @root.modelsCache}} {{sanitizedName}},
{{/each}}{{#each ../parsedParameters.cookie}}        {{solveOasType 'java' schema @root.modelsCache}} {{sanitizedName}},
{{/each}}{{#each ../parsedParameters.query}}        {{solveOasType 'java' schema @root.modelsCache}} {{sanitizedName}},
{{/each}}{{#each ../parsedParameters.header}}        {{solveOasType 'java' schema @root.modelsCache}} {{sanitizedName}},
{{/each}}        {{#if empty}}Handler<AsyncResult<HttpResponse>> handler{{else if json}}{{solveOasType 'java' schema @root.modelsCache}} body, Handler<AsyncResult<HttpResponse>> handler{{else if form}}MultiMap form, Handler<AsyncResult<HttpResponse>> handler{{else if stream}}ReadStream<Buffer> stream, Handler<AsyncResult<HttpResponse>> handler{{else if buffer}}Buffer buffer, Handler<AsyncResult<HttpResponse>> handler{{else}}Handler<AsyncResult<HttpResponse>> handler{{/if}}) {
        // Check required params
        {{#each ../parsedParameters.path}}if ({{sanitizedName}} == null) throw new NullPointerException("Missing parameter {{sanitizedName}} in {{in}}");
        {{/each}}{{#each ../parsedParameters.cookie}}{{#if required}}if ({{sanitizedName}} == null) throw new NullPointerException("Missing parameter {{sanitizedName}} in {{in}}");
        {{/if}}{{/each}}{{#each ../parsedParameters.query}}{{#if required}}if ({{sanitizedName}} == null) throw new NullPointerException("Missing parameter {{sanitizedName}} in {{in}}");
        {{/if}}{{/each}}{{#each ../parsedParameters.header}}{{#if required}}if ({{sanitizedName}} == null) throw new NullPointerException("Missing parameter {{sanitizedName}} in {{in}}");
        {{/if}}{{/each}}

        // Generate the uri
        String uri = "{{get (split ../path "?") 0}}";{{#if ../parsedParameters.path}}
        {{{{raw-helper}}}}uri = uri.replaceAll("\\{{1}([.;?*+]*([^\\{\\}.;?*+]+)[^\\}]*)\\}{1}", "{$2}"); //Remove * . ; ? from url template{{{{/raw-helper}}}}
        {{#each ../parsedParameters.path}}uri = uri.replace("{{brace name}}", this.{{renderFunctionName}}("{{name}}", {{castIfNeeded 'java' sanitizedName schema @root.modelsCache}}));
        {{/each}}{{/if}}

        HttpRequest request = client.{{ ../method }}(uri);

        MultiMap requestCookies = MultiMap.caseInsensitiveMultiMap();
        {{#each ../parsedParameters.cookie}}if ({{sanitizedName}} != null) this.{{renderFunctionName}}("{{name}}", {{castIfNeeded 'java' sanitizedName schema @root.modelsCache}}, requestCookies);
        {{/each}}{{#each ../parsedParameters.header}}if ({{sanitizedName}} != null) this.{{renderFunctionName}}("{{name}}", {{castIfNeeded 'java' sanitizedName schema @root.modelsCache}}, request);
        {{/each}}{{#each ../parsedParameters.query}}if ({{sanitizedName}} != null) this.{{renderFunctionName}}("{{name}}", {{castIfNeeded 'java' sanitizedName schema @root.modelsCache}}, request);
        {{/each}}{{#if contentType}}this.addHeaderParam("Content-Type", "{{contentType}}", request);
        {{/if}}{{#if ../security}}{{#each ../security}}this.attach{{capitalize (sanitize @key)}}Security(request, requestCookies);
        {{/each}}{{/if}}

        this.renderAndAttachCookieHeader(request, requestCookies);
        {{#if empty}}request.send(handler);{{else if json}}request.sendJson({{castBodyIfNeeded 'java' 'body' schema @root.modelsCache}}, handler);{{else if form}}request.sendForm(form, handler);{{else if stream}}request.sendStream(stream, handler);{{else if buffer}}request.sendBuffer(buffer, handler);{{else}}request.send(handler);{{/if}}
    }

    {{/each}}
    {{/each}}

    {{#if openapiSpec.components.securitySchemes}}// Security requirements functions
    {{#each openapiSpec.components.securitySchemes}}
    private void attach{{capitalize (sanitize @key)}}Security (HttpRequest request, MultiMap cookies) {
{{#and (eq type 'http') (eq scheme 'basic')}}        this.addHeaderParam("Authorization", "Basic " + Base64.getEncoder()
            .encode((this.{{toVariableName @key}}_username + ":" + this.{{toVariableName @key}}_password).getBytes()), request);
{{/and}}{{#or (and (eq type 'http') (eq scheme 'bearer')) (eq type 'oauth2') (eq type 'openIdConnect')}}        this.addHeaderParam("Authorization", "Bearer " + {{toVariableName @key}}_token, request);
{{/or}}{{#if (eq type 'apiKey')}}{{#if (eq in 'header')}}        this.addHeaderParam("{{name}}", this.{{toVariableName @key}}_token, request);
{{else if (eq in 'cookie')}}        this.renderCookieParam("{{name}}", this.{{toVariableName @key}}_token, cookies);
{{else if (eq in 'query')}}        this.addQueryParam("{{name}}", this.{{toVariableName @key}}_token, request);{{/if}}{{/if}}
    }

{{/each}}{{/if}}{{#if openapiSpec.components.securitySchemes}}    // Security parsedParameters functions
    {{#each openapiSpec.components.securitySchemes}}{{#and (eq type 'http') (eq scheme 'basic')}}
    /**
     * Set username and password for basic http security scheme {{@key}}
     */
    public void set{{capitalize (sanitize @key)}}Params(String username, String password) {
        this.{{toVariableName @key}}_username = username;
        this.{{toVariableName @key}}_password = password;
    }
    {{/and}}{{#or (and (eq type 'http') (eq scheme 'bearer')) (eq type 'apiKey') (eq type 'oauth2') (eq type 'openIdConnect')}}
    /**
     * Set access token for security scheme {{@key}}
     */
    public void set{{capitalize (sanitize @key)}}Token(String token) {
        this.{{toVariableName @key}}_token = token;
    }
    {{/or}}{{/each}}{{/if}}

    // Parameters functions

    /**
     * Remove a cookie parameter from the cookie cache
     *
     * @param paramName name of cookie parameter
     */
    public void removeCookie(String paramName) {
        cookieParams.remove(paramName);
    }

    private void addQueryParam(String paramName, Object value, HttpRequest request) {
        request.addQueryParam(paramName, String.valueOf(value));
    }

    /**
     * Add a cookie param in cookie cache
     *
     * @param paramName name of cookie parameter
     * @param value value of cookie parameter
     */
    public void addCookieParam(String paramName, Object value) {
        renderCookieParam(paramName, value, cookieParams);
    }

    private void addHeaderParam(String headerName, Object value, HttpRequest request) {
        request.putHeader(headerName, String.valueOf(value));
    }

    private String renderPathParam(String paramName, Object value) {
        return String.valueOf(value);
    }

    private void renderCookieParam(String paramName, Object value, MultiMap map) {
        map.remove(paramName);
        map.add(paramName, String.valueOf(value));
    }

    /**
     * Following this table to implement parsedParameters serialization
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | style          | explode | in            | array                               | object                                 |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | matrix         | false   | path          | ;color=blue,black,brown             | ;color=R,100,G,200,B,150               |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | matrix         | true    | path          | ;color=blue;color=black;color=brown | ;R=100;G=200;B=150                     |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | label          | false   | path          | .blue.black.brown                   | .R.100.G.200.B.150                     |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | label          | true    | path          | .blue.black.brown                   | .R=100.G=200.B=150                     |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | form           | false   | query, cookie | color=blue,black,brown              | color=R,100,G,200,B,150                |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | form           | true    | query, cookie | color=blue&color=black&color=brown  | R=100&G=200&B=150                      |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | simple         | false   | path, header  | blue,black,brown                    | R,100,G,200,B,150                      |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | simple         | true    | path, header  | blue,black,brown                    | R=100,G=200,B=150                      |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | spaceDelimited | false   | query         | blue%20black%20brown                | R%20100%20G%20200%20B%20150            |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | pipeDelimited  | false   | query         | blue|black|brown                    | R|100|G|200                            |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | deepObject     | true    | query         | n/a                                 | color[R]=100&color[G]=200&color[B]=150 |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     */

    /**
     * Render path value with matrix style exploded/not exploded
     *
     * @param paramName
     * @param value
     * @return
     */
    private String renderPathMatrix(String paramName, Object value) {
        return ";" + paramName + "=" + String.valueOf(value);
    }

    /**
     * Render path array with matrix style and not exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | matrix         | false   | path          | ;color=blue,black,brown             | ;color=R,100,G,200,B,150               |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param paramName
     * @param values
     * @return
     */
    private String renderPathArrayMatrix(String paramName, List<Object> values) {
        String serialized = String.join(",", values.stream().map(object -> encode(String.valueOf(object))).collect(Collectors.toList()));
        return ";" + paramName + "=" + serialized;
    }

    /**
     * Render path object with matrix style and not exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | matrix         | false   | path          | ;color=blue,black,brown             | ;color=R,100,G,200,B,150               |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param paramName
     * @param values
     * @return
     */
    private String renderPathObjectMatrix(String paramName, Map<String, Object> values) {
        List<String> listToSerialize = new ArrayList<>();
        for (Map.Entry<String, Object> entry : values.entrySet()) {
            listToSerialize.add(entry.getKey());
            listToSerialize.add(encode(String.valueOf(entry.getValue())));
        }
        String serialized = String.join(",", listToSerialize);
        return ";" + paramName + "=" + serialized;
    }

    /**
     * Render path array with matrix style and exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | matrix         | true    | path          | ;color=blue;color=black;color=brown | ;R=100;G=200;B=150                     |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param paramName
     * @param values
     * @return
     */
    private String renderPathArrayMatrixExplode(String paramName, List<Object> values) {
        return String.join("", values.stream().map(object -> ";" + paramName + "=" + encode(String.valueOf(object))).collect(Collectors.toList()));
    }

    /**
     * Render path object with matrix style and exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | matrix         | true    | path          | ;color=blue;color=black;color=brown | ;R=100;G=200;B=150                     |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param paramName
     * @param values
     * @return
     */
    private String renderPathObjectMatrixExplode(String paramName, Map<String, Object> values) {
      return String.join("", values.entrySet().stream().map(
        entry -> ";" + entry.getKey() + "=" + encode(String.valueOf(entry.getValue()))
      ).collect(Collectors.toList()));
    }

    /**
     * Render path value with label style exploded/not exploded
     *
     * @param paramName
     * @param value
     * @return
     */
    private String renderPathLabel(String paramName, Object value) {
        return "." + String.valueOf(value);
    }

    /**
     * Render path array with label style and not exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | label          | false   | path          | .blue.black.brown                   | .R.100.G.200.B.150                     |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param paramName
     * @param values
     * @return
     */
    private String renderPathArrayLabel(String paramName, List<Object> values) {
        return "." + String.join(".", values.stream().map(object -> encode(String.valueOf(object))).collect(Collectors.toList()));
    }

    /**
     * Render path object with label style and not exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | label          | false   | path          | .blue.black.brown                   | .R.100.G.200.B.150                     |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param paramName
     * @param values
     * @return
     */
    private String renderPathObjectLabel(String paramName, Map<String, Object> values) {
        List<String> listToSerialize = new ArrayList<>();
        for (Map.Entry<String, Object> entry : values.entrySet()) {
            listToSerialize.add(entry.getKey());
            listToSerialize.add(encode(String.valueOf(entry.getValue())));
        }
        return "." + String.join(".", listToSerialize);
    }

    /**
     * Render path array with label style and exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | label          | true    | path          | .blue.black.brown                   | .R=100.G=200.B=150                     |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param paramName
     * @param values
     * @return
     */
    private String renderPathArrayLabelExplode(String paramName, List<Object> values) {
        return renderPathArrayLabel(paramName, values);
    }

    /**
     * Render path object with label style and exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | label          | true    | path          | .blue.black.brown                   | .R=100.G=200.B=150                     |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param paramName
     * @param values
     * @return
     */
    private String renderPathObjectLabelExplode(String paramName, Map<String, Object> values) {
        String result = "";
        for (Map.Entry<String, Object> value : values.entrySet())
            result = result.concat("." + value.getKey() + "=" + encode(String.valueOf(value.getValue())));
        return result;
    }

    /**
     * Render path array with simple style and not exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | simple         | false   | path, header  | blue,black,brown                    | R,100,G,200,B,150                      |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param paramName
     * @param values
     * @return
     */
    private String renderPathArraySimple(String paramName, List<Object> values) {
        return String.join(",", values.stream().map(object -> encode(String.valueOf(object))).collect(Collectors.toList()));
    }

    /**
     * Render path object with simple style and not exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | simple         | false   | path, header  | blue,black,brown                    | R,100,G,200,B,150                      |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param paramName
     * @param values
     * @return
     */
    private String renderPathObjectSimple(String paramName, Map<String, Object> values) {
        List<String> listToSerialize = new ArrayList<>();
        for (Map.Entry<String, Object> entry : values.entrySet()) {
            listToSerialize.add(entry.getKey());
            listToSerialize.add(encode(String.valueOf(entry.getValue())));
        }
        return String.join(",", listToSerialize);
    }

    /**
     * Render path array with simple style and exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | simple         | true    | path, header  | blue,black,brown                    | R=100,G=200,B=150                      |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param paramName
     * @param values
     * @return
     */
    private String renderPathArraySimpleExplode(String paramName, List<Object> values) {
        return renderPathArraySimple(paramName, values);
    }

    /**
     * Render path object with simple style and exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | simple         | true    | path, header  | blue,black,brown                    | R=100,G=200,B=150                      |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param paramName
     * @param values
     * @return
     */
    private String renderPathObjectSimpleExplode(String paramName, Map<String, Object> values) {
        return String.join(",",
          values.entrySet().stream().map((entry) -> entry.getKey() + "=" + encode(String.valueOf(entry.getValue()))).collect(Collectors.toList()));
    }

    /**
     * Add query array with form style and not exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | form           | false   | query, cookie | color=blue,black,brown              | color=R,100,G,200,B,150                |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param paramName
     * @param values
     * @param request
     */
    private void addQueryArrayForm(String paramName, List<Object> values, HttpRequest request) {
        String serialized = String.join(",", values.stream().map(object -> String.valueOf(object)).collect(Collectors.toList()));
        this.addQueryParam(paramName, serialized, request); // Encoding is done by WebClient
    }

    /**
     * Add query object with form style and not exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | form           | false   | query, cookie | color=blue,black,brown              | color=R,100,G,200,B,150                |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param paramName
     * @param values
     * @param request
     */
    private void addQueryObjectForm(String paramName, Map<String, Object> values, HttpRequest request) {
        List<String> listToSerialize = new ArrayList<>();
        for (Map.Entry<String, Object> entry : values.entrySet()) {
            listToSerialize.add(entry.getKey());
            listToSerialize.add(String.valueOf(entry.getValue()));
        }
        String serialized = String.join(",", listToSerialize);
        this.addQueryParam(paramName, serialized, request); // Encoding is done by WebClient
    }

    /**
     * Add cookie array with form style and not exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | form           | false   | query, cookie | color=blue,black,brown              | color=R,100,G,200,B,150                |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param paramName
     * @param values
     */
    private void renderCookieArrayForm(String paramName, List<Object> values, MultiMap map) {
        String value = String.join(",", values.stream().map(object -> String.valueOf(object)).collect(Collectors.toList()));
        map.remove(paramName);
        map.add(paramName, value);
    }

    /**
     * Add a cookie array parameter in cookie cache
     *
     * @param paramName name of cookie parameter
     * @param values list of values of cookie parameter
     */
    public void addCookieArrayForm(String paramName, List<Object> values) {
        renderCookieArrayForm(paramName, values, cookieParams);
    }

    /**
     * Add cookie object with form style and not exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | form           | false   | query, cookie | color=blue,black,brown              | color=R,100,G,200,B,150                |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param paramName
     * @param values
     */
    private void renderCookieObjectForm(String paramName, Map<String, Object> values, MultiMap map) {
        List<String> listToSerialize = new ArrayList<>();
        for (Map.Entry<String, Object> entry : values.entrySet()) {
            listToSerialize.add(entry.getKey());
            listToSerialize.add(String.valueOf(entry.getValue()));
        }
        String value = String.join(",", listToSerialize);
        map.remove(paramName);
        map.add(paramName, value);
    }

    /**
     * Add a cookie object parameter in cookie cache
     *
     * @param paramName name of cookie parameter
     * @param values map of values of cookie parameter
     */
    public void addCookieObjectForm(String paramName, Map<String, Object> values) {
        renderCookieObjectForm(paramName, values, cookieParams);
    }

    /**
     * Add query array with form style and exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | form           | true    | query, cookie | color=blue&color=black&color=brown  | R=100&G=200&B=150                      |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param paramName
     * @param values
     * @param request
     */
    private void addQueryArrayFormExplode(String paramName, List<Object> values, HttpRequest request) {
        for (Object value : values)
            this.addQueryParam(paramName, String.valueOf(value), request);
    }

    /**
     * Add query object with form style and exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | form           | true    | query, cookie | color=blue&color=black&color=brown  | R=100&G=200&B=150                      |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param paramName
     * @param values
     * @param request
     */
    private void addQueryObjectFormExplode(String paramName, Map<String, Object> values, HttpRequest request) {
        for (Map.Entry<String, Object> value : values.entrySet())
            this.addQueryParam(value.getKey(), String.valueOf(value.getValue()), request);
    }

    /**
     * Add cookie array with form style and exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | form           | true    | query, cookie | color=blue&color=black&color=brown  | R=100&G=200&B=150                      |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param paramName
     * @param values
     */
    private void renderCookieArrayFormExplode(String paramName, List<Object> values, MultiMap map) {
        map.remove(paramName);
        for (Object value : values)
            map.add(paramName, String.valueOf(value));
    }

    public void addCookieArrayFormExplode(String paramName, List<Object> values) {
        renderCookieArrayFormExplode(paramName, values, cookieParams);
    }

    /**
     * Add cookie object with form style and exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | form           | true    | query, cookie | color=blue&color=black&color=brown  | R=100&G=200&B=150                      |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param paramName
     * @param values
     */
    private void renderCookieObjectFormExplode(String paramName, Map<String, Object> values, MultiMap map) {
        for (Map.Entry<String, Object> value : values.entrySet()) {
            map.remove(value.getKey());
            map.add(value.getKey(), String.valueOf(value.getValue()));
        }
    }

    public void addCookieObjectFormExplode(String paramName, Map<String, Object> values) {
        renderCookieObjectFormExplode(paramName, values, cookieParams);
    }

    /**
     * Add header array with simple style and not exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | simple         | false   | path, header  | blue,black,brown                    | R,100,G,200,B,150                      |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param headerName
     * @param values
     * @param request
     */
    private void addHeaderArraySimple(String headerName, List<Object> values, HttpRequest request) {
        String serialized = String.join(",", values.stream().map(object -> String.valueOf(object)).collect(Collectors.toList()));
        this.addHeaderParam(headerName, serialized, request);
    }

    /**
     * Add header object with simple style and not exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | simple         | false   | path, header  | blue,black,brown                    | R,100,G,200,B,150                      |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param headerName
     * @param values
     * @param request
     */
    private void addHeaderObjectSimple(String headerName, Map<String, Object> values, HttpRequest request) {
        List<String> listToSerialize = new ArrayList<>();
        for (Map.Entry<String, Object> entry : values.entrySet()) {
            listToSerialize.add(entry.getKey());
            listToSerialize.add(String.valueOf(entry.getValue()));
        }
        String serialized = String.join(",", listToSerialize);
        this.addHeaderParam(headerName, serialized, request);
    }

    /**
     * Add header array with simple style and exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | simple         | true    | path, header  | blue,black,brown                    | R=100,G=200,B=150                      |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param headerName
     * @param values
     * @param request
     */
    private void addHeaderArraySimpleExplode(String headerName, List<Object> values, HttpRequest request) {
        this.addHeaderArraySimple(headerName, values, request);
    }

    /**
     * Add header object with simple style and exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | simple         | true    | path, header  | blue,black,brown                    | R=100,G=200,B=150                      |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param headerName
     * @param values
     * @param request
     */
    private void addHeaderObjectSimpleExplode(String headerName, Map<String, Object> values, HttpRequest request) {
        List<String> listToSerialize = new ArrayList<>();
        for (Map.Entry<String, Object> entry : values.entrySet()) {
            listToSerialize.add(entry.getKey() + "=" + String.valueOf(entry.getValue()));
        }
        String serialized = String.join(",", listToSerialize);
        this.addHeaderParam(headerName, serialized, request);
    }

    /**
     * Add query array with spaceDelimited style and not exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | spaceDelimited | false   | query         | blue%20black%20brown                | R%20100%20G%20200%20B%20150            |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param paramName
     * @param values
     * @param request
     */
    private void addQueryArraySpaceDelimited(String paramName, List<Object> values, HttpRequest request) {
        String serialized = String.join(" ", values.stream().map(object -> String.valueOf(object)).collect(Collectors.toList()));
        this.addQueryParam(paramName, serialized, request); // Encoding is done by WebClient
    }

    /**
     * Add query object with spaceDelimited style and not exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | spaceDelimited | false   | query         | blue%20black%20brown                | R%20100%20G%20200%20B%20150            |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param paramName
     * @param values
     * @param request
     */
    private void addQueryObjectSpaceDelimited(String paramName, Map<String, Object> values, HttpRequest request) {
        List<String> listToSerialize = new ArrayList<>();
        for (Map.Entry<String, Object> entry : values.entrySet()) {
            listToSerialize.add(entry.getKey());
            listToSerialize.add(String.valueOf(entry.getValue()));
        }
        String serialized = String.join(" ", listToSerialize);
        this.addQueryParam(paramName, serialized, request); // Encoding is done by WebClient
    }

    /**
     * Add query array with pipeDelimited style and not exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | pipeDelimited  | false   | query         | blue|black|brown                    | R|100|G|200                            |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param paramName
     * @param values
     * @param request
     */
    private void addQueryArrayPipeDelimited(String paramName, List<Object> values, HttpRequest request) {
        String serialized = String.join("|", values.stream().map(object -> String.valueOf(object)).collect(Collectors.toList()));
        this.addQueryParam(paramName, serialized, request); // Encoding is done by WebClient
    }

    /**
     * Add query object with pipeDelimited style and not exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | pipeDelimited  | false   | query         | blue|black|brown                    | R|100|G|200                            |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param paramName
     * @param values
     * @param request
     */
    private void addQueryObjectPipeDelimited(String paramName, Map<String, Object> values, HttpRequest request) {
        List<String> listToSerialize = new ArrayList<>();
        for (Map.Entry<String, Object> entry : values.entrySet()) {
            listToSerialize.add(entry.getKey());
            listToSerialize.add(String.valueOf(entry.getValue()));
        }
        String serialized = String.join("|", listToSerialize);
        this.addQueryParam(paramName, serialized, request); // Encoding is done by WebClient
    }

    /**
     * Add query object with deepObject style and exploded
     *
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     | deepObject     | true    | query         | n/a                                 | color[R]=100&color[G]=200&color[B]=150 |
     +----------------+---------+---------------+-------------------------------------+----------------------------------------+
     *
     * @param paramName
     * @param values
     * @param request
     */
    private void addQueryObjectDeepObjectExplode(String paramName, Map<String, Object> values, HttpRequest request) {
        for (Map.Entry<String, Object> entry : values.entrySet()) {
            this.addQueryParam(paramName + "[" + entry.getKey() + "]", String.valueOf(entry.getValue()), request);
        }
    }


    private void renderAndAttachCookieHeader(HttpRequest request, MultiMap otherCookies) {
        if ((otherCookies == null || otherCookies.isEmpty()) && cookieParams.isEmpty())
            return;
        List<String> listToSerialize = new ArrayList<>();
        for (Map.Entry<String, String> e : cookieParams.entries()) {
            if (otherCookies!= null && !otherCookies.contains(e.getKey())) {
                try {
                    listToSerialize.add(URLEncoder.encode(e.getKey(), "UTF-8") + "=" + URLEncoder.encode(e.getValue(), "UTF-8"));
                } catch (UnsupportedEncodingException e1) {
                }
            }
        }
        if (otherCookies != null) {
            for (Map.Entry<String, String> e : otherCookies.entries()) {
                try {
                    listToSerialize.add(URLEncoder.encode(e.getKey(), "UTF-8") + "=" + URLEncoder.encode(e.getValue(), "UTF-8"));
                } catch (UnsupportedEncodingException e1) {
                }
            }
        }
        request.putHeader("Cookie", String.join("; ", listToSerialize));
    }

    // Other functions

    private String encode(String s) {
        try {
            return URLEncoder.encode(s, "UTF-8");
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Close the connection with server
     *
     */
    public void close() {
        client.close();
    }

}
