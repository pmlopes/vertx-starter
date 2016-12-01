(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['npm/package.json'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "  \"description\": \""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.description : stack1), depth0))
    + "\",\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    \""
    + alias4(((helper = (helper = helpers.groupId || (depth0 != null ? depth0.groupId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"groupId","hash":{},"data":data}) : helper)))
    + ":"
    + alias4(((helper = (helper = helpers.artifactId || (depth0 != null ? depth0.artifactId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"artifactId","hash":{},"data":data}) : helper)))
    + "\": \""
    + alias4(((helper = (helper = helpers.version || (depth0 != null ? depth0.version : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"version","hash":{},"data":data}) : helper)))
    + "\""
    + ((stack1 = helpers.unless.call(alias1,(data && data.last),{"name":"unless","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"4":function(container,depth0,helpers,partials,data) {
    return ",";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {};

  return "{\n  \"name\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.name : stack1), depth0))
    + "\",\n  \"version\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.version : stack1), depth0))
    + "\",\n"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.description : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n  \"mainVerticle\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.main : stack1), depth0))
    + "\",\n\n  \"scripts\": {\n    \"install\": \"node ./webpack.config.js\",\n    \"postinstall\": \"mvn -f .vertx/pom.xml clean package\",\n\n    \"build\": \"./node_modules/.bin/webpack\",\n    \"build:release\": \"./node_modules/.bin/webpack -p\",\n\n    \"prestart\": \"./node_modules/.bin/webpack\",\n    \"start\": \"java -jar run.jar\",\n\n    \"watch\": \"npm run start -- --redeploy=\\\"src/**\\\" --on-redeploy=\\\"npm run watch\\\"\"\n  },\n\n  \"dependencies\": {\n  },\n\n  \"devDependencies\": {\n    \"babel-core\": \"^6.5.1\",\n    \"babel-loader\": \"^6.2.2\",\n    \"babel-preset-es2015\": \"^6.5.0\",\n    \"webpack\": \"^1.12.13\"\n  },\n\n  \"javaDependencies\": {\n"
    + ((stack1 = helpers.each.call(alias3,(depth0 != null ? depth0.selectedDependencies : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  }\n}\n";
},"useData":true});
templates['npm/webpack.config.js'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "var _package = require('./package.json');\nvar fs = require('fs');\nvar path = require('path');\n\nif ('install' === process.env.npm_lifecycle_event) {\n  // generate pom.xml file\n  var javaDependencies = _package.javaDependencies || {};\n  var pom =\n    '<?xml version=\"1.0\" encoding=\"UTF-8\"?>\\n' +\n    '<project xmlns=\"http://maven.apache.org/POM/4.0.0\"\\n' +\n    '         xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\\n' +\n    '         xsi:schemaLocation=\"http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd\">\\n' +\n    '\\n' +\n    '  <modelVersion>4.0.0</modelVersion>\\n' +\n    '  <packaging>pom</packaging>\\n' +\n    '\\n' +\n    '  <groupId>' + _package.name + '</groupId>\\n' +\n    '  <artifactId>' + _package.name + '</artifactId>\\n' +\n    '  <version>' + _package.version + '</version>\\n' +\n    '\\n' +\n    '  <name>' + _package.name + '</name>\\n' +\n    '  <description>' + (_package.description || '') + '</description>\\n' +\n    '\\n' +\n    '  <dependencies>\\n';\n\n  for (var dep in javaDependencies) {\n    if (javaDependencies.hasOwnProperty(dep)) {\n      pom +=\n        '    <dependency>\\n' +\n        '      <groupId>' + dep.split(':')[0] + '</groupId>\\n' +\n        '      <artifactId>' + dep.split(':')[1] + '</artifactId>\\n' +\n        '      <version>' + javaDependencies[dep] + '</version>\\n' +\n        '    </dependency>\\n';\n    }\n  }\n\n  pom +=\n    '  </dependencies>\\n' +\n    '\\n' +\n    '  <build>\\n' +\n    '    <plugins>\\n' +\n    '      <plugin>\\n' +\n    '        <groupId>org.apache.maven.plugins</groupId>\\n' +\n    '        <artifactId>maven-dependency-plugin</artifactId>\\n' +\n    '        <version>2.10</version>\\n' +\n    '        <executions>\\n' +\n    '          <execution>\\n' +\n    '            <id>unpack-dependencies</id>\\n' +\n    '            <phase>package</phase>\\n' +\n    '            <goals>\\n' +\n    '              <goal>unpack-dependencies</goal>\\n' +\n    '            </goals>\\n' +\n    '            <configuration>\\n' +\n    '              <includes>**/*.js</includes>\\n' +\n    '              <outputDirectory>${project.basedir}/../node_modules</outputDirectory>\\n' +\n    '              <overWriteReleases>false</overWriteReleases>\\n' +\n    '              <overWriteSnapshots>true</overWriteSnapshots>\\n' +\n    '            </configuration>\\n' +\n    '          </execution>\\n' +\n    '        </executions>\\n' +\n    '      </plugin>\\n' +\n    '      <plugin>\\n' +\n    '        <groupId>org.apache.maven.plugins</groupId>\\n' +\n    '        <artifactId>maven-shade-plugin</artifactId>\\n' +\n    '        <version>2.3</version>\\n' +\n    '        <executions>\\n' +\n    '          <execution>\\n' +\n    '            <phase>package</phase>\\n' +\n    '            <goals>\\n' +\n    '              <goal>shade</goal>\\n' +\n    '            </goals>\\n' +\n    '            <configuration>\\n' +\n    '              <transformers>\\n' +\n    '                <transformer implementation=\"org.apache.maven.plugins.shade.resource.ManifestResourceTransformer\">\\n' +\n    '                  <manifestEntries>\\n' +\n    '                    <Main-Class>io.vertx.core.Launcher</Main-Class>\\n' +\n    '                    <Main-Verticle>' + _package.mainVerticle + '</Main-Verticle>\\n' +\n    '                  </manifestEntries>\\n' +\n    '                </transformer>\\n' +\n    '                <transformer implementation=\"org.apache.maven.plugins.shade.resource.AppendingTransformer\">\\n' +\n    '                  <resource>META-INF/services/io.vertx.core.spi.VerticleFactory</resource>\\n' +\n    '                </transformer>\\n' +\n    '              </transformers>\\n' +\n    '              <outputFile>${project.basedir}/../run.jar</outputFile>\\n' +\n    '            </configuration>\\n' +\n    '          </execution>\\n' +\n    '        </executions>\\n' +\n    '      </plugin>\\n' +\n    '    </plugins>\\n' +\n    '  </build>\\n' +\n    '</project>\\n';\n\n  // mkdir -p .vertx\n  fs.mkdir(path.resolve(__dirname, '.vertx'),function(err){\n    if (!err || (err && err.code === 'EEXIST')) {\n      // generate pom.xml\n      fs.writeFile(path.resolve(__dirname, '.vertx/pom.xml'), pom, function (err) {\n        if (err) {\n          console.error(err);\n          process.exit(1);\n        }\n      });\n    } else {\n      if (err) {\n        console.error(err);\n        process.exit(1);\n      }\n    }\n  });\n}\n\nmodule.exports = {\n\n  entry: path.resolve(__dirname, 'src/main.js'),\n\n  output: {\n    filename: _package.mainVerticle\n  },\n\n  module: {\n    loaders: [\n      {test: /\\.js$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015'}\n    ]\n  }\n};\n";
},"useData":true});
templates['npm/.gitignore'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "# temp files\npom.xml\n# build files\ntarget\nnode_modules\n# compiled file (your app)\nserver.js\n# runtime files\n.vertx\nrun.jar\n";
},"useData":true});
templates['npm/src/main.js'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "// your code goes here...\nvertx.createHttpServer()\n  .requestHandler(function (req) {\n    req.response()\n      .putHeader(\"content-type\", \"text/plain\")\n      .end(\"Hello from Vert.x!\");\n}).listen(8080);\n";
},"useData":true});
templates['stack/vertx-stack.json'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    {\n      \"groupId\": \""
    + alias4(((helper = (helper = helpers.groupId || (depth0 != null ? depth0.groupId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"groupId","hash":{},"data":data}) : helper)))
    + "\",\n      \"artifactId\": \""
    + alias4(((helper = (helper = helpers.artifactId || (depth0 != null ? depth0.artifactId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"artifactId","hash":{},"data":data}) : helper)))
    + "\",\n      \"version\": \""
    + alias4(((helper = (helper = helpers.version || (depth0 != null ? depth0.version : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"version","hash":{},"data":data}) : helper)))
    + "\",\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.classifier : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.transitive : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "      \"included\": "
    + alias4(((helper = (helper = helpers.checked || (depth0 != null ? depth0.checked : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"checked","hash":{},"data":data}) : helper)))
    + "\n    }"
    + ((stack1 = helpers.unless.call(alias1,(data && data.last),{"name":"unless","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper;

  return "      \"classifier\": \""
    + container.escapeExpression(((helper = (helper = helpers.classifier || (depth0 != null ? depth0.classifier : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"classifier","hash":{},"data":data}) : helper)))
    + "\",\n";
},"4":function(container,depth0,helpers,partials,data) {
    var helper;

  return "      \"transitive\": "
    + container.escapeExpression(((helper = (helper = helpers.transitive || (depth0 != null ? depth0.transitive : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"transitive","hash":{},"data":data}) : helper)))
    + ",\n";
},"6":function(container,depth0,helpers,partials,data) {
    return ",";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "{\n  \"dependencies\": [\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.dependencies : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  ]\n}\n";
},"useData":true});
templates['maven/pom.xml'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "  <description>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.description : stack1), depth0))
    + "</description>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <dependency>\n      <groupId>"
    + alias4(((helper = (helper = helpers.groupId || (depth0 != null ? depth0.groupId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"groupId","hash":{},"data":data}) : helper)))
    + "</groupId>\n      <artifactId>"
    + alias4(((helper = (helper = helpers.artifactId || (depth0 != null ? depth0.artifactId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"artifactId","hash":{},"data":data}) : helper)))
    + "</artifactId>\n      <version>"
    + alias4(((helper = (helper = helpers.version || (depth0 != null ? depth0.version : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"version","hash":{},"data":data}) : helper)))
    + "</version>\n    </dependency>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {};

  return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<project xmlns=\"http://maven.apache.org/POM/4.0.0\"\n         xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n         xsi:schemaLocation=\"http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd\">\n\n  <modelVersion>4.0.0</modelVersion>\n\n  <groupId>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.groupId : stack1), depth0))
    + "</groupId>\n  <artifactId>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.artifactId : stack1), depth0))
    + "</artifactId>\n  <version>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.version : stack1), depth0))
    + "</version>\n\n  <name>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.name : stack1), depth0))
    + "</name>\n"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.description : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n  <properties>\n    <main.verticle>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.main : stack1), depth0))
    + "</main.verticle>\n  </properties>\n\n  <dependencies>\n"
    + ((stack1 = helpers.each.call(alias3,(depth0 != null ? depth0.selectedDependencies : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  </dependencies>\n\n  <build>\n    <pluginManagement>\n      <plugins>\n        <plugin>\n          <artifactId>maven-compiler-plugin</artifactId>\n          <version>3.1</version>\n          <configuration>\n            <source>1.8</source>\n            <target>1.8</target>\n          </configuration>\n        </plugin>\n      </plugins>\n    </pluginManagement>\n\n    <plugins>\n      <plugin>\n        <groupId>org.apache.maven.plugins</groupId>\n        <artifactId>maven-shade-plugin</artifactId>\n        <version>2.3</version>\n        <executions>\n          <execution>\n            <phase>package</phase>\n            <goals>\n              <goal>shade</goal>\n            </goals>\n            <configuration>\n              <transformers>\n                <transformer implementation=\"org.apache.maven.plugins.shade.resource.ManifestResourceTransformer\">\n                  <manifestEntries>\n                    <Main-Class>io.vertx.core.Launcher</Main-Class>\n                    <Main-Verticle>${main.verticle}</Main-Verticle>\n                  </manifestEntries>\n                </transformer>\n                <transformer implementation=\"org.apache.maven.plugins.shade.resource.AppendingTransformer\">\n                  <resource>META-INF/services/io.vertx.core.spi.VerticleFactory</resource>\n                </transformer>\n              </transformers>\n              <artifactSet>\n              </artifactSet>\n              <outputFile>${project.build.directory}/${project.artifactId}-${project.version}-fat.jar</outputFile>\n            </configuration>\n          </execution>\n        </executions>\n      </plugin>\n    </plugins>\n  </build>\n</project>\n";
},"useData":true});
templates['maven/.gitignore'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "# build files\ntarget\n# runtime files\n.vertx\n";
},"useData":true});
templates['maven/src/main/java/MainVerticle.java'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "package "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.packageName : stack1), depth0))
    + ";\n\nimport io.vertx.core.AbstractVerticle;\n\npublic class "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.className : stack1), depth0))
    + " extends AbstractVerticle {\n\n  @Override\n  public void start() {\n    // your code goes here...\n    vertx.createHttpServer().requestHandler(req -> {\n      req.response()\n        .putHeader(\"content-type\", \"text/plain\")\n        .end(\"Hello from Vert.x!\");\n    }).listen(8080);\n  }\n}\n";
},"useData":true});
templates['maven/src/main/resources/main.groovy'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "vertx.createHttpServer().requestHandler({ req ->\n  req.response().putHeader(\"content-type\", \"text/html\").end(\"<html><body><h1>Hello from vert.x!</h1></body></html>\")\n}).listen(8080)\n";
},"useData":true});
templates['maven/src/main/resources/main.rb'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "$vertx.create_http_server().request_handler() { |req|\n  req.response().put_header(\"content-type\", \"text/html\").end(\"<html><body><h1>Hello from vert.x!</h1></body></html>\")\n}.listen(8080)\n";
},"useData":true});
templates['web+mongo/src/main/java/MainVerticle.java'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "package "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.packageName : stack1), depth0))
    + ";\n\nimport io.vertx.core.AbstractVerticle;\nimport io.vertx.core.http.HttpHeaders;\nimport io.vertx.core.json.JsonArray;\nimport io.vertx.core.json.JsonObject;\nimport io.vertx.ext.mongo.MongoClient;\nimport io.vertx.ext.web.Router;\nimport io.vertx.ext.web.handler.BodyHandler;\nimport io.vertx.ext.web.handler.StaticHandler;\nimport io.vertx.ext.web.templ.JadeTemplateEngine;\n\n/**\n * This is an example application to showcase the usage of MongDB and Vert.x Web.\n *\n * In this application you will see the usage of:\n *\n *  * JADE templates\n *  * Mongo Client\n *  * Vert.x Web\n *\n * The application allows to list, create and delete mongo documents using a simple web interface.\n *\n */\npublic class "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.className : stack1), depth0))
    + " extends AbstractVerticle {\n\n  @Override\n  public void start() throws Exception {\n\n    // Create a mongo client using all defaults (connect to localhost and default port) using the database name \"demo\".\n    final MongoClient mongo = MongoClient.createShared(vertx, new JsonObject().put(\"db_name\", \"demo\"));\n\n    // In order to use a JADE template we first need to create an engine\n    final JadeTemplateEngine jade = JadeTemplateEngine.create();\n\n    // To simplify the development of the web components we use a Router to route all HTTP requests\n    // to organize our code in a reusable way.\n    final Router router = Router.router(vertx);\n\n    // Enable the body parser to we can get the form data and json documents in out context.\n    router.route().handler(BodyHandler.create());\n\n    // Entry point to the application, this will render a custom JADE template.\n    router.get(\"/\").handler(ctx -> {\n      // we define a hardcoded title for our application\n      ctx.put(\"title\", \"Vert.x Web\");\n\n      // and now delegate to the engine to render it.\n      jade.render(ctx, \"templates/index\", res -> {\n        if (res.succeeded()) {\n          ctx.response().putHeader(HttpHeaders.CONTENT_TYPE, \"text/html\").end(res.result());\n        } else {\n          ctx.fail(res.cause());\n        }\n      });\n    });\n\n    // and now we mount the handlers in their appropriate routes\n\n    // Read all users from the mongo collection.\n    router.get(\"/users\").handler(ctx -> {\n      // issue a find command to mongo to fetch all documents from the \"users\" collection.\n      mongo.find(\"users\", new JsonObject(), lookup -> {\n        // error handling\n        if (lookup.failed()) {\n          ctx.fail(lookup.cause());\n          return;\n        }\n\n        // now convert the list to a JsonArray because it will be easier to encode the final object as the response.\n        final JsonArray json = new JsonArray();\n        for (JsonObject o : lookup.result()) {\n          json.add(o);\n        }\n\n        // since we are producing json we should inform the browser of the correct content type.\n        ctx.response().putHeader(HttpHeaders.CONTENT_TYPE, \"application/json\");\n        // encode to json string\n        ctx.response().end(json.encode());\n      });\n    });\n\n    // Create a new document on mongo.\n    router.post(\"/users\").handler(ctx -> {\n      // since jquery is sending data in multipart-form format to avoid preflight calls, we need to convert it to JSON.\n      JsonObject user = new JsonObject()\n              .put(\"username\", ctx.request().getFormAttribute(\"username\"))\n              .put(\"email\", ctx.request().getFormAttribute(\"email\"))\n              .put(\"fullname\", ctx.request().getFormAttribute(\"fullname\"))\n              .put(\"location\", ctx.request().getFormAttribute(\"location\"))\n              .put(\"age\", ctx.request().getFormAttribute(\"age\"))\n              .put(\"gender\", ctx.request().getFormAttribute(\"gender\"));\n\n      // insert into mongo\n      mongo.insert(\"users\", user, lookup -> {\n        // error handling\n        if (lookup.failed()) {\n          ctx.fail(lookup.cause());\n          return;\n        }\n\n        // inform that the document was created\n        ctx.response().setStatusCode(201);\n        ctx.response().end();\n      });\n    });\n\n    // Remove a document from mongo.\n    router.delete(\"/users/:id\").handler(ctx -> {\n      // catch the id to remove from the url /users/:id and transform it to a mongo query.\n      mongo.removeOne(\"users\", new JsonObject().put(\"_id\", ctx.request().getParam(\"id\")), lookup -> {\n        // error handling\n        if (lookup.failed()) {\n          ctx.fail(lookup.cause());\n          return;\n        }\n\n        // inform the browser that there is nothing to return.\n        ctx.response().setStatusCode(204);\n        ctx.response().end();\n      });\n    });\n\n    // Serve the non private static pages\n    router.route().handler(StaticHandler.create());\n\n    // start a HTTP web server on port 8080\n    vertx.createHttpServer().requestHandler(router::accept).listen(8080);\n  }\n}\n";
},"useData":true});
templates['web+mongo/src/main/resources/webroot/js/app.js'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "// Userlist data array for filling in info box\nvar userListData = [];\n\n// DOM Ready =============================================================\n$(document).ready(function () {\n\n    // Populate the user table on initial page load\n    populateTable();\n\n    // Username link click\n    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);\n\n    // Add User button click\n    $('#btnAddUser').on('click', addUser);\n\n    // Delete User link click\n    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);\n\n});\n\n// Functions =============================================================\n\n// Fill table with data\nfunction populateTable() {\n\n    // Empty content string\n    var tableContent = '';\n\n    // jQuery AJAX call for JSON\n    $.getJSON('/users', function (data) {\n\n        // Stick our user data array into a userlist variable in the global object\n        userListData = data;\n\n        // For each item in our JSON, add a table row and cells to the content string\n        $.each(data, function () {\n            tableContent += '<tr>';\n            tableContent += '<td><a href=\"#\" class=\"linkshowuser\" rel=\"' + this.username + '\" title=\"Show Details\">' + this.username + '</a></td>';\n            tableContent += '<td>' + this.email + '</td>';\n            tableContent += '<td><a href=\"#\" class=\"linkdeleteuser\" rel=\"' + this._id + '\">delete</a></td>';\n            tableContent += '</tr>';\n        });\n\n        // Inject the whole content string into our existing HTML table\n        $('#userList table tbody').html(tableContent);\n    });\n};\n\n// Show User Info\nfunction showUserInfo(event) {\n\n    // Prevent Link from Firing\n    event.preventDefault();\n\n    // Retrieve username from link rel attribute\n    var thisUserName = $(this).attr('rel');\n\n    // Get Index of object based on id value\n    var arrayPosition = userListData.map(function (arrayItem) {\n        return arrayItem.username;\n    }).indexOf(thisUserName);\n\n    // Get our User Object\n    var thisUserObject = userListData[arrayPosition];\n\n    //Populate Info Box\n    $('#userInfoName').text(thisUserObject.fullname);\n    $('#userInfoAge').text(thisUserObject.age);\n    $('#userInfoGender').text(thisUserObject.gender);\n    $('#userInfoLocation').text(thisUserObject.location);\n\n};\n\n// Add User\nfunction addUser(event) {\n    event.preventDefault();\n\n    // Super basic validation - increase errorCount variable if any fields are blank\n    var errorCount = 0;\n    $('#addUser input').each(function (index, val) {\n        if ($(this).val() === '') {\n            errorCount++;\n        }\n    });\n\n    // Check and make sure errorCount's still at zero\n    if (errorCount === 0) {\n\n        // If it is, compile all user info into one object\n        var newUser = {\n            'username': $('#addUser fieldset input#inputUserName').val(),\n            'email': $('#addUser fieldset input#inputUserEmail').val(),\n            'fullname': $('#addUser fieldset input#inputUserFullname').val(),\n            'age': $('#addUser fieldset input#inputUserAge').val(),\n            'location': $('#addUser fieldset input#inputUserLocation').val(),\n            'gender': $('#addUser fieldset input#inputUserGender').val()\n        };\n\n        // Use AJAX to post the object to our adduser service\n        $.ajax({\n            type: 'POST',\n            data: newUser,\n            url: '/users'\n        }).done(function (response) {\n            // Clear the form inputs\n            $('#addUser fieldset input').val('');\n\n            // Update the table\n            populateTable();\n        }).fail(function () {\n            // If something goes wrong, alert the error message that our service returned\n            alert('Error: Something went wrong.');\n        });\n    }\n    else {\n        // If errorCount is more than 0, error out\n        alert('Please fill in all fields');\n        return false;\n    }\n};\n\n// Delete User\nfunction deleteUser(event) {\n\n    event.preventDefault();\n\n    // Pop up a confirmation dialog\n    var confirmation = confirm('Are you sure you want to delete this user?');\n\n    // Check and make sure the user confirmed\n    if (confirmation === true) {\n\n        // If they did, do our delete\n        $.ajax({\n            type: 'DELETE',\n            url: '/users/' + $(this).attr('rel')\n        }).done(function (response) {\n            // Update the table\n            populateTable();\n\n        }).fail(function () {\n            alert('Error: Something went wrong.');\n            // Update the table\n            populateTable();\n        });\n    } else {\n\n        // If they said no to the confirm, do nothing\n        return false;\n\n    }\n\n};\n";
},"useData":true});
templates['web+mongo/src/main/resources/webroot/css/style.css'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "body {\n  padding: 30px;\n  font: 14px \"Lucida Grande\", Helvetica, Arial, sans-serif;\n}\n\nh2 {\n	margin:0 0 .5em 0;\n}\n\na {\n  color: #00B7FF;\n}\n\n#wrapper {\n	padding-left:312px;\n	position:relative;\n}\n\n#userList {\n	margin:0 0 30px 0;\n}\n	#userList table {\n		border-collapse:separate;\n		border-spacing:1px;\n		background:#CCC;\n	}\n		#userList table th {\n			background:#EEE;\n			font-weight:600;\n			padding:10px 20px;\n			text-align:center;\n		}\n		#userList table tbody {\n			padding:0; margin:0;\n			border-collapse:collapse;\n			border-spacing:0px;\n		}\n			#userList table td {\n				background:#FFF;\n				padding:5px 10px;\n				text-align:center;\n			}\n\n#userInfo {\n	width:250px;\n	position:absolute;\n	top:0; left:0;\n}\n	#userInfo p {\n		padding:15px;\n		border:1px solid #CCC;\n		background:rgba(80,120,255,0.05);\n	}\n\nfieldset {\n	border:0;\n	padding:0; margin:0;\n}\n";
},"useData":true});
templates['web+mongo/src/main/resources/templates/layout.jade'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "doctype html\nhtml\n    head\n        title= context.title\n        link(rel='stylesheet', href='/css/style.css')\n    body\n        block content\n        script(src='http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js')\n        script(src='/js/app.js')\n";
},"useData":true});
templates['web+mongo/src/main/resources/templates/index.jade'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "extends layout\n\nblock content\n    h1= context.title\n    p Welcome to our test\n\n    #wrapper\n        #userInfo\n            h2 User Info\n            p\n                strong Name:\n                |  <span id='userInfoName'></span>\n                br\n                strong Age:\n                |  <span id='userInfoAge'></span>\n                br\n                strong Gender:\n                |  <span id='userInfoGender'></span>\n                br\n                strong Location:\n                |  <span id='userInfoLocation'></span>\n\n        h2 User List\n        #userList\n            table\n                thead\n                    th UserName\n                    th Email\n                    th Delete?\n                tbody\n\n        h2 Add User\n        #addUser\n            fieldset\n                input#inputUserName(type='text', placeholder='Username')\n                input#inputUserEmail(type='text', placeholder='Email')\n                br\n                input#inputUserFullname(type='text', placeholder='Full Name')\n                input#inputUserAge(type='text', placeholder='Age')\n                br\n                input#inputUserLocation(type='text', placeholder='Location')\n                input#inputUserGender(type='text', placeholder='gender')\n                br\n                button#btnAddUser Add User\n";
},"useData":true});
templates['gradle/build.gradle'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "description = '"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.description : stack1), depth0))
    + "'\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "  compile '"
    + alias4(((helper = (helper = helpers.groupId || (depth0 != null ? depth0.groupId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"groupId","hash":{},"data":data}) : helper)))
    + ":"
    + alias4(((helper = (helper = helpers.artifactId || (depth0 != null ? depth0.artifactId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"artifactId","hash":{},"data":data}) : helper)))
    + ":"
    + alias4(((helper = (helper = helpers.version || (depth0 != null ? depth0.version : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"version","hash":{},"data":data}) : helper)))
    + "'\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {};

  return "plugins {\n  id 'java'\n  id 'application'\n  id 'com.github.johnrengelman.shadow' version '1.2.3'\n}\n\nrepositories {\n  mavenCentral()\n}\n\nversion = '"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.version : stack1), depth0))
    + "'\ngroup = '"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.groupId : stack1), depth0))
    + "'\n"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.description : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "sourceCompatibility = '1.8'\nmainClassName = 'io.vertx.core.Launcher'\n\ndependencies {\n"
    + ((stack1 = helpers.each.call(alias3,(depth0 != null ? depth0.selectedDependencies : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "}\n\nshadowJar {\n  classifier = 'fat'\n  manifest {\n    attributes 'Main-Verticle': '"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.main : stack1), depth0))
    + "'\n  }\n  mergeServiceFiles {\n    include 'META-INF/services/io.vertx.core.spi.VerticleFactory'\n  }\n}\n\ntask wrapper(type: Wrapper) {\n  gradleVersion = '2.8'\n}\n";
},"useData":true});
templates['gradle/.gitignore'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "# build files\nbuild\n# runtime files\n.vertx\n";
},"useData":true});
templates['gradle/src/main/java/MainVerticle.java'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "package "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.packageName : stack1), depth0))
    + ";\n\nimport io.vertx.core.AbstractVerticle;\n\npublic class "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.className : stack1), depth0))
    + " extends AbstractVerticle {\n\n  @Override\n  public void start() {\n    // your code goes here...\n    vertx.createHttpServer().requestHandler(req -> {\n      req.response()\n        .putHeader(\"content-type\", \"text/plain\")\n        .end(\"Hello from Vert.x!\");\n    }).listen(8080);\n  }\n}\n";
},"useData":true});
templates['gradle/src/main/resources/main.groovy'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "// your code goes here...\nvertx.createHttpServer().requestHandler({ req ->\n  req.response().putHeader(\"content-type\", \"text/html\").end(\"<html><body><h1>Hello from vert.x!</h1></body></html>\")\n}).listen(8080)\n";
},"useData":true});
templates['gradle/src/main/resources/main.rb'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "# your code goes here...\n$vertx.create_http_server().request_handler() { |req|\n  req.response().put_header(\"content-type\", \"text/html\").end(\"<html><body><h1>Hello from vert.x!</h1></body></html>\")\n}.listen(8080)\n";
},"useData":true});
})();
