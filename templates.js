(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['maven+service-proxy/pom.xml'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "  <description>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.description : stack1), depth0))
    + "</description>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {};

  return "    <dependency>\n      <groupId>"
    + alias2(alias1((depth0 != null ? depth0.groupId : depth0), depth0))
    + "</groupId>\n      <artifactId>"
    + alias2(alias1((depth0 != null ? depth0.artifactId : depth0), depth0))
    + "</artifactId>\n"
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.version : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.scope : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </dependency>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "      <version>"
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.version : depth0), depth0))
    + "</version>\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "      <scope>"
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.scope : depth0), depth0))
    + "</scope>\n";
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
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.packageName : stack1), depth0))
    + ".MainVerticle</main.verticle>\n  </properties>\n\n  <dependencies>\n"
    + ((stack1 = helpers.each.call(alias3,(depth0 != null ? depth0.selectedDependencies : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  </dependencies>\n\n  <build>\n    <pluginManagement>\n      <plugins>\n        <plugin>\n          <artifactId>maven-compiler-plugin</artifactId>\n          <version>3.1</version>\n          <configuration>\n            <source>1.8</source>\n            <target>1.8</target>\n            <annotationProcessors>\n              <annotationProcessor>io.vertx.codegen.CodeGenProcessor</annotationProcessor>\n            </annotationProcessors>\n            <compilerArgs>\n              <arg>-AoutputDirectory=${project.basedir}/src/main</arg>\n            </compilerArgs>\n            <generatedSourcesDirectory>${project.basedir}/src/main/generated</generatedSourcesDirectory>\n          </configuration>\n        </plugin>\n      </plugins>\n    </pluginManagement>\n\n    <plugins>\n      <plugin>\n        <groupId>org.apache.maven.plugins</groupId>\n        <artifactId>maven-shade-plugin</artifactId>\n        <version>2.3</version>\n        <executions>\n          <execution>\n            <phase>package</phase>\n            <goals>\n              <goal>shade</goal>\n            </goals>\n            <configuration>\n              <transformers>\n                <transformer implementation=\"org.apache.maven.plugins.shade.resource.ManifestResourceTransformer\">\n                  <manifestEntries>\n                    <Main-Class>io.vertx.core.Launcher</Main-Class>\n                    <Main-Verticle>${main.verticle}</Main-Verticle>\n                  </manifestEntries>\n                </transformer>\n                <transformer implementation=\"org.apache.maven.plugins.shade.resource.AppendingTransformer\">\n                  <resource>META-INF/services/io.vertx.core.spi.VerticleFactory</resource>\n                </transformer>\n              </transformers>\n              <artifactSet>\n              </artifactSet>\n              <outputFile>${project.build.directory}/${project.artifactId}-${project.version}-fat.jar</outputFile>\n            </configuration>\n          </execution>\n        </executions>\n      </plugin>\n    </plugins>\n  </build>\n</project>\n";
},"useData":true});
templates['maven+service-proxy/src/main/java/impl/ServiceImpl.java'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "package "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.packageName : stack1), depth0))
    + ".impl;\n\nimport "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.packageName : stack1), depth0))
    + ".Service;\n\nimport io.vertx.core.Vertx;\nimport io.vertx.core.json.JsonObject;\n\npublic class ServiceImpl implements Service {\n\n  public ServiceImpl(Vertx vertx, JsonObject config) {\n    // initialization...\n  }\n\n  // Implement your service here...\n\n  public void close() {\n    // clean up...\n  }\n}\n";
},"useData":true});
templates['maven+service-proxy/src/main/java/Service.java'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "package "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.packageName : stack1), depth0))
    + ";\n\nimport io.vertx.codegen.annotations.ProxyGen;\nimport io.vertx.codegen.annotations.VertxGen;\nimport io.vertx.core.Vertx;\nimport io.vertx.serviceproxy.ProxyHelper;\n\n/**\n * Service exposed on the event bus.\n */\n@VertxGen\n@ProxyGen\npublic interface Service {\n  /**\n    * Method called to create a proxy (to consume the service).\n    *\n    * @param vertx   vert.x\n    * @param address the address on the vent bus where the service is served.\n    * @return the proxy\n    */\n  static Service createProxy(Vertx vertx, String address) {\n    return ProxyHelper.createProxy(Service.class, vertx, address);\n  }\n}\n";
},"useData":true});
templates['maven+service-proxy/src/main/java/MainVerticle.java'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "package "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.packageName : stack1), depth0))
    + ";\n\nimport "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.packageName : stack1), depth0))
    + ".impl.ServiceImpl;\n\nimport io.vertx.core.AbstractVerticle;\nimport io.vertx.serviceproxy.ProxyHelper;\n\npublic class MainVerticle extends AbstractVerticle {\n\n  private ServiceImpl service;\n\n  @Override\n  public void start() throws Exception {\n    service = new ServiceImpl(vertx, config());\n    ProxyHelper.registerService(Service.class, vertx, service, \""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.packageName : stack1), depth0))
    + ".service\");\n  }\n\n  @Override\n  public void stop() throws Exception {\n    service.close();\n  }\n}\n";
},"useData":true});
templates['maven+service-proxy/src/main/java/package-info.java'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "@ModuleGen(name=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.artifactId : stack1), depth0))
    + "\", groupPackage = \""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.packageName : stack1), depth0))
    + "\")\npackage "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.packageName : stack1), depth0))
    + ";\n\nimport io.vertx.codegen.annotations.ModuleGen;\n";
},"useData":true});
templates['npm/tsconfig.json'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "{\n  \"compilerOptions\": {\n    \"outDir\": \"./dist/\",\n    \"sourceMap\": true,\n    \"noImplicitAny\": true,\n    \"module\": \"commonjs\",\n    \"target\": \"es5\",\n    \"allowJs\": true\n  }\n}\n";
},"useData":true});
templates['npm/.gitignore'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "# temp files\npom.xml\n# build files\ntarget\nnode_modules\n# compiled file (your app)\nserver.js\n# runtime files\n.vertx\nrun.jar\n";
},"useData":true});
templates['npm/src/main.js'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "// your code goes here...\nvertx.createHttpServer()\n  .requestHandler(function (req) {\n    req.response()\n      .putHeader(\"content-type\", \"text/plain\")\n      .end(\"Hello from Vert.x!\");\n}).listen(8080);\n\nconsole.log('Listening at http://127.0.0.1:8080');\n";
},"useData":true});
templates['npm/src/main.ts'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "// your code goes here...\ndeclare var vertx: any;\n\nvertx.createHttpServer()\n  .requestHandler(function (req: any) {\n    req.response()\n      .putHeader(\"content-type\", \"text/plain\")\n      .end(\"Hello from Vert.x!\");\n}).listen(8080);\n\nconsole.log('Listening at http://127.0.0.1:8080');\n";
},"useData":true});
templates['npm/package.json'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "  \"description\": \""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.description : stack1), depth0))
    + "\",\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "    \"babel-core\": \"^6.22.1\",\n    \"babel-loader\": \"^6.2.10\",\n    \"babel-preset-es2015\": \"^6.22.0\",\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "    \"typescript\": \"^2.3.2\",\n    \"ts-loader\":\"^2.0.3\",\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "    \""
    + alias2(alias1((depth0 != null ? depth0.groupId : depth0), depth0))
    + ":"
    + alias2(alias1((depth0 != null ? depth0.artifactId : depth0), depth0))
    + "\": \""
    + alias2(alias1((depth0 != null ? depth0.version : depth0), depth0))
    + "\""
    + ((stack1 = helpers.unless.call(depth0 != null ? depth0 : {},(data && data.last),{"name":"unless","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"8":function(container,depth0,helpers,partials,data) {
    return ",";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {};

  return "{\n  \"name\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.name : stack1), depth0))
    + "\",\n  \"version\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.version : stack1), depth0))
    + "\",\n"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.description : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n  \"mainVerticle\": \"main.js\",\n\n  \"scripts\": {\n    \"clean\": \"rm -Rf .vertx\",\n\n    \"install\": \"node ./webpack.config.js\",\n    \"postinstall\": \"mvn -f .vertx/pom.xml clean package\",\n\n    \"build\": \"./node_modules/.bin/webpack\",\n    \"build:release\": \"npm run build -- -p\",\n\n    \"prestart\": \"npm run build\",\n    \"start\": \"java -jar run.jar\",\n\n    \"watch\": \"npm run start -- --redeploy=\\\"src/**\\\" --on-redeploy=\\\"npm run watch\\\"\"\n  },\n\n  \"dependencies\": {\n  },\n\n  \"devDependencies\": {\n"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.javascript : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.typescript : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    \"webpack\": \"^2.2.0\"\n  },\n\n  \"javaDependencies\": {\n"
    + ((stack1 = helpers.each.call(alias3,(depth0 != null ? depth0.selectedDependencies : depth0),{"name":"each","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  }\n}\n";
},"useData":true});
templates['npm/webpack.config.js'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "  entry: path.resolve(__dirname, 'src/main.js'),\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "  entry: path.resolve(__dirname, 'src/main.ts'),\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "    loaders: [\n      { test: /\\.js$/, exclude: /node_modules/, loader: 'babel-loader' }\n    ]\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "    rules: [\n      {\n        test: /\\.tsx?$/,\n        loader: 'ts-loader',\n        exclude: /node_modules/,\n      }\n    ]\n";
},"9":function(container,depth0,helpers,partials,data) {
    return "  resolve: {\n    extensions: [\".tsx\", \".ts\", \".js\"]\n  },\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "var _package = require('./package.json');\nvar fs = require('fs');\nvar path = require('path');\n\nif ('install' === process.env.npm_lifecycle_event) {\n  // generate pom.xml file\n  var javaDependencies = _package.javaDependencies || {};\n  var pom =\n    '<?xml version=\"1.0\" encoding=\"UTF-8\"?>\\n' +\n    '<project xmlns=\"http://maven.apache.org/POM/4.0.0\"\\n' +\n    '         xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\\n' +\n    '         xsi:schemaLocation=\"http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd\">\\n' +\n    '\\n' +\n    '  <modelVersion>4.0.0</modelVersion>\\n' +\n    '  <packaging>pom</packaging>\\n' +\n    '\\n' +\n    '  <groupId>' + _package.name + '</groupId>\\n' +\n    '  <artifactId>' + _package.name + '</artifactId>\\n' +\n    '  <version>' + _package.version + '</version>\\n' +\n    '\\n' +\n    '  <name>' + _package.name + '</name>\\n' +\n    '  <description>' + (_package.description || '') + '</description>\\n' +\n    '\\n' +\n    '  <dependencies>\\n';\n\n  for (var dep in javaDependencies) {\n    if (javaDependencies.hasOwnProperty(dep)) {\n      pom +=\n        '    <dependency>\\n' +\n        '      <groupId>' + dep.split(':')[0] + '</groupId>\\n' +\n        '      <artifactId>' + dep.split(':')[1] + '</artifactId>\\n' +\n        '      <version>' + javaDependencies[dep] + '</version>\\n' +\n        '    </dependency>\\n';\n    }\n  }\n\n  pom +=\n    '  </dependencies>\\n' +\n    '\\n' +\n    '  <build>\\n' +\n    '    <plugins>\\n' +\n    '      <plugin>\\n' +\n    '        <groupId>org.apache.maven.plugins</groupId>\\n' +\n    '        <artifactId>maven-dependency-plugin</artifactId>\\n' +\n    '        <version>2.10</version>\\n' +\n    '        <executions>\\n' +\n    '          <execution>\\n' +\n    '            <id>unpack-dependencies</id>\\n' +\n    '            <phase>package</phase>\\n' +\n    '            <goals>\\n' +\n    '              <goal>unpack-dependencies</goal>\\n' +\n    '            </goals>\\n' +\n    '            <configuration>\\n' +\n    '              <includes>**/*.js</includes>\\n' +\n    '              <outputDirectory>${project.basedir}/../node_modules</outputDirectory>\\n' +\n    '              <overWriteReleases>false</overWriteReleases>\\n' +\n    '              <overWriteSnapshots>true</overWriteSnapshots>\\n' +\n    '            </configuration>\\n' +\n    '          </execution>\\n' +\n    '        </executions>\\n' +\n    '      </plugin>\\n' +\n    '      <plugin>\\n' +\n    '        <groupId>org.apache.maven.plugins</groupId>\\n' +\n    '        <artifactId>maven-shade-plugin</artifactId>\\n' +\n    '        <version>2.3</version>\\n' +\n    '        <executions>\\n' +\n    '          <execution>\\n' +\n    '            <phase>package</phase>\\n' +\n    '            <goals>\\n' +\n    '              <goal>shade</goal>\\n' +\n    '            </goals>\\n' +\n    '            <configuration>\\n' +\n    '              <transformers>\\n' +\n    '                <transformer implementation=\"org.apache.maven.plugins.shade.resource.ManifestResourceTransformer\">\\n' +\n    '                  <manifestEntries>\\n' +\n    '                    <Main-Class>io.vertx.core.Launcher</Main-Class>\\n' +\n    '                    <Main-Verticle>' + _package.mainVerticle + '</Main-Verticle>\\n' +\n    '                  </manifestEntries>\\n' +\n    '                </transformer>\\n' +\n    '                <transformer implementation=\"org.apache.maven.plugins.shade.resource.AppendingTransformer\">\\n' +\n    '                  <resource>META-INF/services/io.vertx.core.spi.VerticleFactory</resource>\\n' +\n    '                </transformer>\\n' +\n    '              </transformers>\\n' +\n    '              <outputFile>${project.basedir}/../run.jar</outputFile>\\n' +\n    '            </configuration>\\n' +\n    '          </execution>\\n' +\n    '        </executions>\\n' +\n    '      </plugin>\\n' +\n    '    </plugins>\\n' +\n    '  </build>\\n' +\n    '</project>\\n';\n\n  // mkdir -p .vertx\n  fs.mkdir(path.resolve(__dirname, '.vertx'),function(err){\n    if (!err || (err && err.code === 'EEXIST')) {\n      // generate pom.xml\n      fs.writeFile(path.resolve(__dirname, '.vertx/pom.xml'), pom, function (err) {\n        if (err) {\n          console.error(err);\n          process.exit(1);\n        }\n      });\n    } else {\n      if (err) {\n        console.error(err);\n        process.exit(1);\n      }\n    }\n  });\n}\n\n// exclude vert.x modules\nvar vertxModules = [\n  function (context, request, callback) {\n    if (/^vertx-js\\//.test(request)) {\n      return callback(null, 'commonjs ' + request);\n    }\n    callback();\n  }\n];\n\nfor (dep in javaDependencies) {\n  if (javaDependencies.hasOwnProperty(dep)) {\n    var mavenDep = dep.split(':');\n    // exclude the meta-package\n    if (mavenDep[1] !== 'vertx-lang-js') {\n      vertxModules.push(function (context, request, callback) {\n        if (new RegExp('^' + mavenDep[1] + '-js/').test(request)) {\n          return callback(null, 'commonjs ' + request);\n        }\n        callback();\n      });\n    }\n  }\n}\n\n// here be the webpack configuations...\nmodule.exports = [];\n\nmodule.exports.push({\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.javascript : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.typescript : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n  output: {\n    filename: _package.mainVerticle,\n    path: __dirname\n  },\n\n  externals: vertxModules,\n\n  module: {\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.javascript : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.typescript : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  },\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.typescript : stack1),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n  plugins: []\n});\n\n// // if you're doing both server and web then enable the\n// // following config for building the web side\n//\n// module.exports.push({\n//   entry: path.resolve(__dirname, 'src/client/index.js'),\n//   devtool: 'source-map',\n//\n//   output: {\n//     filename: 'webroot/bundle.js'\n//   },\n//\n//   module: {\n//     loaders: [\n//       { test: /\\.js$/, exclude: /node_modules/, loader: 'babel-loader' }\n//     ]\n//   },\n//\n//   plugins: []\n// });\n";
},"useData":true});
templates['sbt/.gitignore'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "# sbt\nlib_managed\nproject/project\ntarget\n\n# Worksheets (Eclipse or IntelliJ)\n*.sc\n\n# Eclipse\n.cache*\n.classpath\n.project\n.scala_dependencies\n.settings\n.target\n.worksheet\n\n# IntelliJ\n.idea\n\n# ENSIME\n.ensime\n.ensime_lucene\n.ensime_cache\n\n# Mac\n.DS_Store\n\n# Akka Persistence\njournal\nsnapshots\n\n# Log files\n*.log\n";
},"useData":true});
templates['sbt/.scalafmt'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "--style defaultWithAlign\n--spacesInImportCurlyBraces true\n--danglingParentheses true\n";
},"useData":true});
templates['sbt/build.sbt'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.core : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.program(5, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "  \""
    + alias2(alias1((depth0 != null ? depth0.groupId : depth0), depth0))
    + "\" % \""
    + alias2(alias1((depth0 != null ? depth0.artifactId : depth0), depth0))
    + "\" % \""
    + alias2(alias1((depth0 != null ? depth0.version : depth0), depth0))
    + "\""
    + ((stack1 = helpers.unless.call(depth0 != null ? depth0 : {},(data && data.last),{"name":"unless","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"3":function(container,depth0,helpers,partials,data) {
    return ",";
},"5":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "  \""
    + alias2(alias1((depth0 != null ? depth0.groupId : depth0), depth0))
    + "\" % \""
    + alias2(alias1((depth0 != null ? depth0.artifactId : depth0), depth0))
    + alias2(alias1(((stack1 = (depths[1] != null ? depths[1].metadata : depths[1])) != null ? stack1.artifactSuffix : stack1), depth0))
    + "\" % \""
    + alias2(alias1((depth0 != null ? depth0.version : depth0), depth0))
    + "\""
    + ((stack1 = helpers.unless.call(depth0 != null ? depth0 : {},(data && data.last),{"name":"unless","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "import sbt.Package._\nimport sbt._\n\nscalaVersion := \"2.12.1\"\n\nlibraryDependencies ++= Seq(\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.selectedDependencies : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ")\n\npackageOptions += ManifestAttributes(\n  (\"Main-Verticle\", \"scala:"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.packageName : stack1), depth0))
    + ".MainVerticle\"))\n\nassemblyMergeStrategy in assembly := {\n  case PathList(\"META-INF\", \"MANIFEST.MF\") => MergeStrategy.discard\n  case PathList(\"META-INF\", xs @ _*) => MergeStrategy.last\n  case PathList(\"META-INF\", \"io.netty.versions.properties\") => MergeStrategy.last\n  case PathList(\"codegen.json\") => MergeStrategy.discard\n  case x =>\n    val oldStrategy = (assemblyMergeStrategy in assembly).value\n    oldStrategy(x)\n}\n";
},"useData":true,"useDepths":true});
templates['sbt/project/build.properties'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "sbt.version = 0.13.13\n";
},"useData":true});
templates['sbt/project/plugins.sbt'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "addSbtPlugin(\"com.eed3si9n\"      % \"sbt-assembly\"        % \"0.14.3\")\naddSbtPlugin(\"com.geirsson\"      % \"sbt-scalafmt\"        % \"0.5.5\")\naddSbtPlugin(\"org.scoverage\"     % \"sbt-scoverage\"       % \"1.5.0\")\naddSbtPlugin(\"net.virtual-void\"  % \"sbt-dependency-graph\"% \"0.8.2\")\n";
},"useData":true});
templates['sbt/project/Build.scala'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "import sbt.Keys._\nimport sbt._\n\nobject Build extends AutoPlugin {\n\n  override def trigger = allRequirements\n\n  override def projectSettings =\n    Vector(\n      scalaVersion := \"2.12.1\",\n      scalacOptions ++= Vector(\n        \"-unchecked\",\n        \"-deprecation\",\n        \"-language:_\",\n        \"-target:jvm-1.8\",\n        \"-encoding\", \"UTF-8\"\n      ),\n      mainClass := Some(\"io.vertx.core.Launcher\"),\n      unmanagedSourceDirectories in Compile := Vector(scalaSource.in(Compile).value),\n      unmanagedSourceDirectories in Test := Vector(scalaSource.in(Test).value),\n      initialCommands in console := \"\"\"|import io.vertx.lang.scala._\n                                       |import io.vertx.scala.core._\n                                       |import io.vertx.scala.sbt._\n                                       |import scala.concurrent.Future\n                                       |import scala.concurrent.Promise\n                                       |import scala.util.Success\n                                       |import scala.util.Failure\n                                       |val vertx = Vertx.vertx\n                                       |implicit val executionContext = io.vertx.lang.scala.VertxExecutionContext(vertx.getOrCreateContext)\n                                       |\"\"\".stripMargin\n    )\n}\n";
},"useData":true});
templates['sbt/src/main/scala/MainVerticle.scala'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "package "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.packageName : stack1), depth0))
    + "\n\nimport io.vertx.lang.scala.ScalaVerticle\n\nclass MainVerticle extends ScalaVerticle {\n\n  override def start(): Unit = {\n    // your code goes here...\n    vertx\n      .createHttpServer()\n      .requestHandler(_.response()\n        .putHeader(\"content-type\", \"text/plain\")\n        .end(\"Hello from Vert.x!\"))\n      .listenFuture(8080, \"0.0.0.0\")\n        .map(_ => ())\n  }\n}\n";
},"useData":true});
templates['stack/vertx-stack.json'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {};

  return "    {\n      \"groupId\": \""
    + alias2(alias1((depth0 != null ? depth0.groupId : depth0), depth0))
    + "\",\n      \"artifactId\": \""
    + alias2(alias1((depth0 != null ? depth0.artifactId : depth0), depth0))
    + "\",\n      \"version\": \""
    + alias2(alias1((depth0 != null ? depth0.version : depth0), depth0))
    + "\",\n"
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.classifier : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.transitive : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "      \"included\": "
    + alias2(alias1((depth0 != null ? depth0.checked : depth0), depth0))
    + "\n    }"
    + ((stack1 = helpers.unless.call(alias3,(data && data.last),{"name":"unless","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "      \"classifier\": \""
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.classifier : depth0), depth0))
    + "\",\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "      \"transitive\": "
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.transitive : depth0), depth0))
    + ",\n";
},"6":function(container,depth0,helpers,partials,data) {
    return ",";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "{\n  \"dependencies\": [\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.dependencies : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  ]\n}\n";
},"useData":true});
templates['web+mongo/src/main/resources/webroot/css/style.css'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "body {\n  padding: 30px;\n  font: 14px \"Lucida Grande\", Helvetica, Arial, sans-serif;\n}\n\nh2 {\n	margin:0 0 .5em 0;\n}\n\na {\n  color: #00B7FF;\n}\n\n#wrapper {\n	padding-left:312px;\n	position:relative;\n}\n\n#userList {\n	margin:0 0 30px 0;\n}\n	#userList table {\n		border-collapse:separate;\n		border-spacing:1px;\n		background:#CCC;\n	}\n		#userList table th {\n			background:#EEE;\n			font-weight:600;\n			padding:10px 20px;\n			text-align:center;\n		}\n		#userList table tbody {\n			padding:0; margin:0;\n			border-collapse:collapse;\n			border-spacing:0px;\n		}\n			#userList table td {\n				background:#FFF;\n				padding:5px 10px;\n				text-align:center;\n			}\n\n#userInfo {\n	width:250px;\n	position:absolute;\n	top:0; left:0;\n}\n	#userInfo p {\n		padding:15px;\n		border:1px solid #CCC;\n		background:rgba(80,120,255,0.05);\n	}\n\nfieldset {\n	border:0;\n	padding:0; margin:0;\n}\n";
},"useData":true});
templates['web+mongo/src/main/resources/webroot/js/app.js'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "// Userlist data array for filling in info box\nvar userListData = [];\n\n// DOM Ready =============================================================\n$(document).ready(function () {\n\n    // Populate the user table on initial page load\n    populateTable();\n\n    // Username link click\n    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);\n\n    // Add User button click\n    $('#btnAddUser').on('click', addUser);\n\n    // Delete User link click\n    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);\n\n});\n\n// Functions =============================================================\n\n// Fill table with data\nfunction populateTable() {\n\n    // Empty content string\n    var tableContent = '';\n\n    // jQuery AJAX call for JSON\n    $.getJSON('/users', function (data) {\n\n        // Stick our user data array into a userlist variable in the global object\n        userListData = data;\n\n        // For each item in our JSON, add a table row and cells to the content string\n        $.each(data, function () {\n            tableContent += '<tr>';\n            tableContent += '<td><a href=\"#\" class=\"linkshowuser\" rel=\"' + this.username + '\" title=\"Show Details\">' + this.username + '</a></td>';\n            tableContent += '<td>' + this.email + '</td>';\n            tableContent += '<td><a href=\"#\" class=\"linkdeleteuser\" rel=\"' + this._id + '\">delete</a></td>';\n            tableContent += '</tr>';\n        });\n\n        // Inject the whole content string into our existing HTML table\n        $('#userList table tbody').html(tableContent);\n    });\n};\n\n// Show User Info\nfunction showUserInfo(event) {\n\n    // Prevent Link from Firing\n    event.preventDefault();\n\n    // Retrieve username from link rel attribute\n    var thisUserName = $(this).attr('rel');\n\n    // Get Index of object based on id value\n    var arrayPosition = userListData.map(function (arrayItem) {\n        return arrayItem.username;\n    }).indexOf(thisUserName);\n\n    // Get our User Object\n    var thisUserObject = userListData[arrayPosition];\n\n    //Populate Info Box\n    $('#userInfoName').text(thisUserObject.fullname);\n    $('#userInfoAge').text(thisUserObject.age);\n    $('#userInfoGender').text(thisUserObject.gender);\n    $('#userInfoLocation').text(thisUserObject.location);\n\n};\n\n// Add User\nfunction addUser(event) {\n    event.preventDefault();\n\n    // Super basic validation - increase errorCount variable if any fields are blank\n    var errorCount = 0;\n    $('#addUser input').each(function (index, val) {\n        if ($(this).val() === '') {\n            errorCount++;\n        }\n    });\n\n    // Check and make sure errorCount's still at zero\n    if (errorCount === 0) {\n\n        // If it is, compile all user info into one object\n        var newUser = {\n            'username': $('#addUser fieldset input#inputUserName').val(),\n            'email': $('#addUser fieldset input#inputUserEmail').val(),\n            'fullname': $('#addUser fieldset input#inputUserFullname').val(),\n            'age': $('#addUser fieldset input#inputUserAge').val(),\n            'location': $('#addUser fieldset input#inputUserLocation').val(),\n            'gender': $('#addUser fieldset input#inputUserGender').val()\n        };\n\n        // Use AJAX to post the object to our adduser service\n        $.ajax({\n            type: 'POST',\n            data: newUser,\n            url: '/users'\n        }).done(function (response) {\n            // Clear the form inputs\n            $('#addUser fieldset input').val('');\n\n            // Update the table\n            populateTable();\n        }).fail(function () {\n            // If something goes wrong, alert the error message that our service returned\n            alert('Error: Something went wrong.');\n        });\n    }\n    else {\n        // If errorCount is more than 0, error out\n        alert('Please fill in all fields');\n        return false;\n    }\n};\n\n// Delete User\nfunction deleteUser(event) {\n\n    event.preventDefault();\n\n    // Pop up a confirmation dialog\n    var confirmation = confirm('Are you sure you want to delete this user?');\n\n    // Check and make sure the user confirmed\n    if (confirmation === true) {\n\n        // If they did, do our delete\n        $.ajax({\n            type: 'DELETE',\n            url: '/users/' + $(this).attr('rel')\n        }).done(function (response) {\n            // Update the table\n            populateTable();\n\n        }).fail(function () {\n            alert('Error: Something went wrong.');\n            // Update the table\n            populateTable();\n        });\n    } else {\n\n        // If they said no to the confirm, do nothing\n        return false;\n\n    }\n\n};\n";
},"useData":true});
templates['web+mongo/src/main/resources/templates/layout.jade'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "doctype html\nhtml\n    head\n        title= context.title\n        link(rel='stylesheet', href='/css/style.css')\n    body\n        block content\n        script(src='http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js')\n        script(src='/js/app.js')\n";
},"useData":true});
templates['web+mongo/src/main/resources/templates/index.jade'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "extends layout\n\nblock content\n    h1= context.title\n    p Welcome to our test\n\n    #wrapper\n        #userInfo\n            h2 User Info\n            p\n                strong Name:\n                |  <span id='userInfoName'></span>\n                br\n                strong Age:\n                |  <span id='userInfoAge'></span>\n                br\n                strong Gender:\n                |  <span id='userInfoGender'></span>\n                br\n                strong Location:\n                |  <span id='userInfoLocation'></span>\n\n        h2 User List\n        #userList\n            table\n                thead\n                    th UserName\n                    th Email\n                    th Delete?\n                tbody\n\n        h2 Add User\n        #addUser\n            fieldset\n                input#inputUserName(type='text', placeholder='Username')\n                input#inputUserEmail(type='text', placeholder='Email')\n                br\n                input#inputUserFullname(type='text', placeholder='Full Name')\n                input#inputUserAge(type='text', placeholder='Age')\n                br\n                input#inputUserLocation(type='text', placeholder='Location')\n                input#inputUserGender(type='text', placeholder='gender')\n                br\n                button#btnAddUser Add User\n";
},"useData":true});
templates['web+mongo/src/main/java/MainVerticle.java'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "package "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.packageName : stack1), depth0))
    + ";\n\nimport io.vertx.core.AbstractVerticle;\nimport io.vertx.core.http.HttpHeaders;\nimport io.vertx.core.json.JsonArray;\nimport io.vertx.core.json.JsonObject;\nimport io.vertx.ext.mongo.MongoClient;\nimport io.vertx.ext.web.Router;\nimport io.vertx.ext.web.handler.BodyHandler;\nimport io.vertx.ext.web.handler.StaticHandler;\nimport io.vertx.ext.web.templ.JadeTemplateEngine;\n\n/**\n * This is an example application to showcase the usage of MongDB and Vert.x Web.\n *\n * In this application you will see the usage of:\n *\n *  * JADE templates\n *  * Mongo Client\n *  * Vert.x Web\n *\n * The application allows to list, create and delete mongo documents using a simple web interface.\n *\n */\npublic class "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.className : stack1), depth0))
    + " extends AbstractVerticle {\n\n  @Override\n  public void start() throws Exception {\n\n    // Create a mongo client using all defaults (connect to localhost and default port) using the database name \"demo\".\n    final MongoClient mongo = MongoClient.createShared(vertx, new JsonObject().put(\"db_name\", \"demo\"));\n\n    // In order to use a JADE template we first need to create an engine\n    final JadeTemplateEngine jade = JadeTemplateEngine.create();\n\n    // To simplify the development of the web components we use a Router to route all HTTP requests\n    // to organize our code in a reusable way.\n    final Router router = Router.router(vertx);\n\n    // Enable the body parser to we can get the form data and json documents in out context.\n    router.route().handler(BodyHandler.create());\n\n    // Entry point to the application, this will render a custom JADE template.\n    router.get(\"/\").handler(ctx -> {\n      // we define a hardcoded title for our application\n      ctx.put(\"title\", \"Vert.x Web\");\n\n      // and now delegate to the engine to render it.\n      jade.render(ctx, \"templates/index\", res -> {\n        if (res.succeeded()) {\n          ctx.response().putHeader(HttpHeaders.CONTENT_TYPE, \"text/html\").end(res.result());\n        } else {\n          ctx.fail(res.cause());\n        }\n      });\n    });\n\n    // and now we mount the handlers in their appropriate routes\n\n    // Read all users from the mongo collection.\n    router.get(\"/users\").handler(ctx -> {\n      // issue a find command to mongo to fetch all documents from the \"users\" collection.\n      mongo.find(\"users\", new JsonObject(), lookup -> {\n        // error handling\n        if (lookup.failed()) {\n          ctx.fail(lookup.cause());\n          return;\n        }\n\n        // now convert the list to a JsonArray because it will be easier to encode the final object as the response.\n        final JsonArray json = new JsonArray();\n        for (JsonObject o : lookup.result()) {\n          json.add(o);\n        }\n\n        // since we are producing json we should inform the browser of the correct content type.\n        ctx.response().putHeader(HttpHeaders.CONTENT_TYPE, \"application/json\");\n        // encode to json string\n        ctx.response().end(json.encode());\n      });\n    });\n\n    // Create a new document on mongo.\n    router.post(\"/users\").handler(ctx -> {\n      // since jquery is sending data in multipart-form format to avoid preflight calls, we need to convert it to JSON.\n      JsonObject user = new JsonObject()\n              .put(\"username\", ctx.request().getFormAttribute(\"username\"))\n              .put(\"email\", ctx.request().getFormAttribute(\"email\"))\n              .put(\"fullname\", ctx.request().getFormAttribute(\"fullname\"))\n              .put(\"location\", ctx.request().getFormAttribute(\"location\"))\n              .put(\"age\", ctx.request().getFormAttribute(\"age\"))\n              .put(\"gender\", ctx.request().getFormAttribute(\"gender\"));\n\n      // insert into mongo\n      mongo.insert(\"users\", user, lookup -> {\n        // error handling\n        if (lookup.failed()) {\n          ctx.fail(lookup.cause());\n          return;\n        }\n\n        // inform that the document was created\n        ctx.response().setStatusCode(201);\n        ctx.response().end();\n      });\n    });\n\n    // Remove a document from mongo.\n    router.delete(\"/users/:id\").handler(ctx -> {\n      // catch the id to remove from the url /users/:id and transform it to a mongo query.\n      mongo.removeOne(\"users\", new JsonObject().put(\"_id\", ctx.request().getParam(\"id\")), lookup -> {\n        // error handling\n        if (lookup.failed()) {\n          ctx.fail(lookup.cause());\n          return;\n        }\n\n        // inform the browser that there is nothing to return.\n        ctx.response().setStatusCode(204);\n        ctx.response().end();\n      });\n    });\n\n    // Serve the non private static pages\n    router.route().handler(StaticHandler.create());\n\n    // start a HTTP web server on port 8080\n    vertx.createHttpServer().requestHandler(router::accept).listen(8080);\n  }\n}\n";
},"useData":true});
templates['maven/pom.xml'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "  <description>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.description : stack1), depth0))
    + "</description>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {};

  return "    <dependency>\n      <groupId>"
    + alias2(alias1((depth0 != null ? depth0.groupId : depth0), depth0))
    + "</groupId>\n      <artifactId>"
    + alias2(alias1((depth0 != null ? depth0.artifactId : depth0), depth0))
    + "</artifactId>\n"
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.version : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.scope : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </dependency>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "      <version>"
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.version : depth0), depth0))
    + "</version>\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "      <scope>"
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.scope : depth0), depth0))
    + "</scope>\n";
},"8":function(container,depth0,helpers,partials,data) {
    return "        <plugin>\n          <artifactId>kotlin-maven-plugin</artifactId>\n          <groupId>org.jetbrains.kotlin</groupId>\n          <version>1.1.0</version>\n          <executions>\n            <execution>\n              <id>compile</id>\n              <goals> <goal>compile</goal> </goals>\n              <configuration>\n                <sourceDirs>\n                  <sourceDir>${project.basedir}/src/main/kotlin</sourceDir>\n                  <sourceDir>${project.basedir}/src/main/java</sourceDir>\n                </sourceDirs>\n              </configuration>\n            </execution>\n            <execution>\n              <id>test-compile</id>\n              <goals> <goal>test-compile</goal> </goals>\n              <configuration>\n                <sourceDirs>\n                  <sourceDir>${project.basedir}/src/test/kotlin</sourceDir>\n                  <sourceDir>${project.basedir}/src/test/java</sourceDir>\n                </sourceDirs>\n              </configuration>\n            </execution>\n          </executions>\n        </plugin>\n";
},"10":function(container,depth0,helpers,partials,data) {
    return "      <plugin>\n        <artifactId>kotlin-maven-plugin</artifactId>\n        <groupId>org.jetbrains.kotlin</groupId>\n      </plugin>\n";
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
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.packageName : stack1), depth0))
    + ".MainVerticle</main.verticle>\n  </properties>\n\n  <dependencies>\n"
    + ((stack1 = helpers.each.call(alias3,(depth0 != null ? depth0.selectedDependencies : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  </dependencies>\n\n  <build>\n    <pluginManagement>\n      <plugins>\n        <plugin>\n          <artifactId>maven-compiler-plugin</artifactId>\n          <version>3.1</version>\n          <configuration>\n            <source>1.8</source>\n            <target>1.8</target>\n          </configuration>\n        </plugin>\n"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.kotlin : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "      </plugins>\n    </pluginManagement>\n\n    <plugins>\n"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.kotlin : stack1),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "      <plugin>\n        <groupId>org.apache.maven.plugins</groupId>\n        <artifactId>maven-shade-plugin</artifactId>\n        <version>2.3</version>\n        <executions>\n          <execution>\n            <phase>package</phase>\n            <goals>\n              <goal>shade</goal>\n            </goals>\n            <configuration>\n              <transformers>\n                <transformer implementation=\"org.apache.maven.plugins.shade.resource.ManifestResourceTransformer\">\n                  <manifestEntries>\n                    <Main-Class>io.vertx.core.Launcher</Main-Class>\n                    <Main-Verticle>${main.verticle}</Main-Verticle>\n                  </manifestEntries>\n                </transformer>\n                <transformer implementation=\"org.apache.maven.plugins.shade.resource.AppendingTransformer\">\n                  <resource>META-INF/services/io.vertx.core.spi.VerticleFactory</resource>\n                </transformer>\n              </transformers>\n              <artifactSet>\n              </artifactSet>\n              <outputFile>${project.build.directory}/${project.artifactId}-${project.version}-fat.jar</outputFile>\n            </configuration>\n          </execution>\n        </executions>\n      </plugin>\n    </plugins>\n  </build>\n</project>\n";
},"useData":true});
templates['maven/.gitignore'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "# build files\ntarget\n# runtime files\n.vertx\n";
},"useData":true});
templates['maven/src/main/resources/main.rb'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "$vertx.create_http_server().request_handler() { |req|\n  req.response().put_header(\"content-type\", \"text/html\").end(\"<html><body><h1>Hello from vert.x!</h1></body></html>\")\n}.listen(8080)\n";
},"useData":true});
templates['maven/src/main/resources/main.groovy'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "vertx.createHttpServer().requestHandler({ req ->\n  req.response().putHeader(\"content-type\", \"text/html\").end(\"<html><body><h1>Hello from vert.x!</h1></body></html>\")\n}).listen(8080)\n";
},"useData":true});
templates['maven/src/main/java/MainVerticle.java'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "package "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.packageName : stack1), depth0))
    + ";\n\nimport io.vertx.core.AbstractVerticle;\n\npublic class MainVerticle extends AbstractVerticle {\n\n  @Override\n  public void start() {\n    // your code goes here...\n    vertx.createHttpServer().requestHandler(req -> {\n      req.response()\n        .putHeader(\"content-type\", \"text/plain\")\n        .end(\"Hello from Vert.x!\");\n    }).listen(8080);\n  }\n}\n";
},"useData":true});
templates['maven/src/main/kotlin/MainVerticle.kt'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "package "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.packageName : stack1), depth0))
    + "\n\nimport io.vertx.core.AbstractVerticle\n\nclass MainVerticle : AbstractVerticle() {\n\n  override fun start() {\n    // your code goes here...\n    vertx.createHttpServer().requestHandler({ req ->\n      req.response()\n        .putHeader(\"content-type\", \"text/plain\")\n        .end(\"Hello from Vert.x!\")\n    }).listen(8080)\n  }\n}\n";
},"useData":true});
templates['web+angular4/tsconfig.json'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "{\n  \"compilerOptions\": {\n    \"module\": \"es2015\",\n    \"moduleResolution\": \"node\",\n    \"target\": \"es5\",\n    \"sourceMap\": true,\n    \"experimentalDecorators\": true,\n    \"emitDecoratorMetadata\": true,\n    \"skipDefaultLibCheck\": true,\n    \"skipLibCheck\": true, // Workaround for https://github.com/angular/angular/issues/17863. Remove this if you upgrade to a fixed version of Angular.\n    \"strict\": true,\n    \"lib\": [ \"es6\", \"dom\" ],\n    \"types\": [ \"webpack-env\" ]\n  },\n  \"exclude\": [ \"bin\", \"node_modules\" ],\n  \"atom\": { \"rewriteTsconfig\": false }\n}\n";
},"useData":true});
templates['web+angular4/src/test/ts/boot-tests.ts'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "// Load required polyfills and testing libraries\nimport 'reflect-metadata';\nimport 'zone.js';\nimport 'zone.js/dist/long-stack-trace-zone';\nimport 'zone.js/dist/proxy.js';\nimport 'zone.js/dist/sync-test';\nimport 'zone.js/dist/jasmine-patch';\nimport 'zone.js/dist/async-test';\nimport 'zone.js/dist/fake-async-test';\nimport * as testing from '@angular/core/testing';\nimport * as testingBrowser from '@angular/platform-browser-dynamic/testing';\n\n// There's no typing for the `__karma__` variable. Just declare it as any\ndeclare var __karma__: any;\ndeclare var require: any;\n\n// Prevent Karma from running prematurely\n__karma__.loaded = function () {};\n\n// First, initialize the Angular testing environment\ntesting.getTestBed().initTestEnvironment(\n    testingBrowser.BrowserDynamicTestingModule,\n    testingBrowser.platformBrowserDynamicTesting()\n);\n\n// Then we find all the tests\nconst context = require.context('../../main/ts', true, /\\.spec\\.ts$/);\n\n// And load the modules\ncontext.keys().map(context);\n\n// Finally, start Karma to run the tests\n__karma__.start();\n";
},"useData":true});
templates['web+angular4/src/test/ts/karma.conf.js'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "// Karma configuration file, see link for more information\n// https://karma-runner.github.io/0.13/config/configuration-file.html\n\nmodule.exports = function (config) {\n    config.set({\n        basePath: '.',\n        frameworks: ['jasmine'],\n        files: [\n            '../../main/resources/webroot/dist/vendor.js',\n            './boot-tests.ts'\n        ],\n        preprocessors: {\n            './boot-tests.ts': ['webpack']\n        },\n        reporters: ['progress'],\n        port: 9876,\n        colors: true,\n        logLevel: config.LOG_INFO,\n        autoWatch: true,\n        browsers: ['Chrome'],\n        mime: { 'application/javascript': ['ts','tsx'] },\n        singleRun: false,\n        webpack: require('../../../webpack.config.js')().filter(config => config.target !== 'node'), // Test against client bundle, because tests run in a browser\n        webpackMiddleware: { stats: 'errors-only' }\n    });\n};\n";
},"useData":true});
templates['web+angular4/src/main/resources/templates/index.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"utf-8\"/>\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>\n  <title>{{ title }}</title>\n  <base href=\"/\"/>\n\n  <link rel=\"stylesheet\" href=\"/dist/vendor.css\"/>\n</head>\n<body>\n  <app>Loading...</app>\n\n  <script src=\"/dist/vendor.js\"></script>\n  <script src=\"/dist/main-client.js\"></script>\n</body>\n</html>\n";
},"useData":true});
templates['web+angular4/src/main/java/MainVerticle.java'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "package "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.packageName : stack1), depth0))
    + ";\n\nimport "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.packageName : stack1), depth0))
    + ".api.WeatherForecastAPI;\nimport io.vertx.core.AbstractVerticle;\nimport io.vertx.ext.web.Router;\nimport io.vertx.ext.web.handler.StaticHandler;\n\nimport io.vertx.ext.web.templ.HandlebarsTemplateEngine;\n\nimport xyz.jetdrone.vertx.hot.reload.HotReload;\n\npublic class MainVerticle extends AbstractVerticle {\n\n  // this should be a build configuration\n  private static final boolean DEBUG = true;\n\n  @Override\n  public void start() throws Exception {\n\n    final HandlebarsTemplateEngine engine = HandlebarsTemplateEngine.create();\n    final Router router = Router.router(vertx);\n\n    if (DEBUG) {\n      // development hot reload\n      router.get().handler(HotReload.create());\n    }\n\n    router.get(\"/\").handler(ctx -> {\n      // we define a hardcoded title for our application\n      ctx.put(\"title\", \"Home Page\");\n\n      engine.render(ctx, \"templates\", \"/index.hbs\", res -> {\n        if (res.succeeded()) {\n          ctx.response().end(res.result());\n        } else {\n          ctx.fail(res.cause());\n        }\n      });\n    });\n\n    // the example weather API\n    router.get(\"/api/weather-forecasts\").handler(new WeatherForecastAPI());\n\n    // Serve the static resources\n    router.route().handler(DEBUG ? HotReload.createStaticHandler() : StaticHandler.create());\n\n    vertx.createHttpServer().requestHandler(router::accept).listen(8080);\n  }\n}\n";
},"useData":true});
templates['web+angular4/src/main/java/api/WeatherForecastAPI.java'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "package "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.packageName : stack1), depth0))
    + ".api;\n\nimport io.vertx.core.Handler;\nimport io.vertx.core.json.JsonArray;\nimport io.vertx.core.json.JsonObject;\nimport io.vertx.ext.web.RoutingContext;\n\nimport java.time.Instant;\nimport java.util.Arrays;\nimport java.util.List;\nimport java.util.Random;\n\nimport static java.time.temporal.ChronoUnit.DAYS;\n\npublic class WeatherForecastAPI implements Handler<RoutingContext> {\n\n    private static final List<String> SUMMARIES = Arrays.asList(\"Freezing\", \"Bracing\", \"Chilly\", \"Cool\", \"Mild\", \"Warm\", \"Balmy\", \"Hot\", \"Sweltering\", \"Scorching\");\n    private Random rnd = new Random();\n\n    @Override\n    public void handle(RoutingContext ctx) {\n\n        final JsonArray response = new JsonArray();\n\n        for (int i = 1; i <= 5; i++) {\n            JsonObject forecast = new JsonObject()\n                    .put(\"dateFormatted\", Instant.now().plus(i, DAYS))\n                    .put(\"temperatureC\", -20 + rnd.nextInt(35))\n                    .put(\"summary\", SUMMARIES.get(rnd.nextInt(SUMMARIES.size())));\n\n            forecast.put(\"temperatureF\", 32 + (int) (forecast.getInteger(\"temperatureC\") / 0.5556));\n\n            response.add(forecast);\n        }\n\n        ctx.response()\n                .putHeader(\"Content-Type\", \"application/json\")\n                .end(response.encode());\n    }\n}\n";
},"useData":true});
templates['web+angular4/src/main/ts/app/app.module.server.ts'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "import { NgModule } from '@angular/core';\nimport { ServerModule } from '@angular/platform-server';\nimport { AppModuleShared } from './app.module.shared';\nimport { AppComponent } from './components/app/app.component';\n\n@NgModule({\n    bootstrap: [ AppComponent ],\n    imports: [\n        ServerModule,\n        AppModuleShared\n    ]\n})\nexport class AppModule {\n}\n";
},"useData":true});
templates['web+angular4/src/main/ts/app/app.module.browser.ts'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "import { NgModule } from '@angular/core';\nimport { BrowserModule } from '@angular/platform-browser';\nimport { AppModuleShared } from './app.module.shared';\nimport { AppComponent } from './components/app/app.component';\n\n@NgModule({\n    bootstrap: [ AppComponent ],\n    imports: [\n        BrowserModule,\n        AppModuleShared\n    ],\n    providers: [\n        { provide: 'BASE_URL', useFactory: getBaseUrl }\n    ]\n})\nexport class AppModule {\n}\n\nexport function getBaseUrl() {\n    return document.getElementsByTagName('base')[0].href;\n}\n";
},"useData":true});
templates['web+angular4/src/main/ts/app/app.module.shared.ts'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "import { NgModule } from '@angular/core';\nimport { CommonModule } from '@angular/common';\nimport { FormsModule } from '@angular/forms';\nimport { HttpModule } from '@angular/http';\nimport { RouterModule } from '@angular/router';\n\nimport { AppComponent } from './components/app/app.component';\nimport { NavMenuComponent } from './components/navmenu/navmenu.component';\nimport { HomeComponent } from './components/home/home.component';\nimport { FetchDataComponent } from './components/fetchdata/fetchdata.component';\nimport { CounterComponent } from './components/counter/counter.component';\n\n@NgModule({\n    declarations: [\n        AppComponent,\n        NavMenuComponent,\n        CounterComponent,\n        FetchDataComponent,\n        HomeComponent\n    ],\n    imports: [\n        CommonModule,\n        HttpModule,\n        FormsModule,\n        RouterModule.forRoot([\n            { path: '', redirectTo: 'home', pathMatch: 'full' },\n            { path: 'home', component: HomeComponent },\n            { path: 'counter', component: CounterComponent },\n            { path: 'fetch-data', component: FetchDataComponent },\n            { path: '**', redirectTo: 'home' }\n        ])\n    ]\n})\nexport class AppModuleShared {\n}\n";
},"useData":true});
templates['web+angular4/src/main/ts/app/components/app/app.component.ts'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "import { Component } from '@angular/core';\n\n@Component({\n    selector: 'app',\n    templateUrl: './app.component.html',\n    styleUrls: ['./app.component.css']\n})\nexport class AppComponent {\n}\n";
},"useData":true});
templates['web+angular4/src/main/ts/app/components/app/app.component.css'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "@media (max-width: 767px) {\n    /* On small screens, the nav menu spans the full width of the screen. Leave a space for it. */\n    .body-content {\n        padding-top: 50px;\n    }\n}\n";
},"useData":true});
templates['web+angular4/src/main/ts/app/components/app/app.component.html'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class='container-fluid'>\n    <div class='row'>\n        <div class='col-sm-3'>\n            <nav-menu></nav-menu>\n        </div>\n        <div class='col-sm-9 body-content'>\n            <router-outlet></router-outlet>\n        </div>\n    </div>\n</div>\n";
},"useData":true});
templates['web+angular4/src/main/ts/app/components/counter/counter.component.spec.ts'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "/// <reference path=\"../../../../../../node_modules/@types/jasmine/index.d.ts\" />\nimport { assert } from 'chai';\nimport { CounterComponent } from './counter.component';\nimport { TestBed, async, ComponentFixture } from '@angular/core/testing';\n\nlet fixture: ComponentFixture<CounterComponent>;\n\ndescribe('Counter component', () => {\n    beforeEach(() => {\n        TestBed.configureTestingModule({ declarations: [CounterComponent] });\n        fixture = TestBed.createComponent(CounterComponent);\n        fixture.detectChanges();\n    });\n\n    it('should display a title', async(() => {\n        const titleText = fixture.nativeElement.querySelector('h1').textContent;\n        expect(titleText).toEqual('Counter');\n    }));\n\n    it('should start with count 0, then increments by 1 when clicked', async(() => {\n        const countElement = fixture.nativeElement.querySelector('strong');\n        expect(countElement.textContent).toEqual('0');\n\n        const incrementButton = fixture.nativeElement.querySelector('button');\n        incrementButton.click();\n        fixture.detectChanges();\n        expect(countElement.textContent).toEqual('1');\n    }));\n});\n";
},"useData":true});
templates['web+angular4/src/main/ts/app/components/counter/counter.component.ts'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "import { Component } from '@angular/core';\n\n@Component({\n    selector: 'counter',\n    templateUrl: './counter.component.html'\n})\nexport class CounterComponent {\n    public currentCount = 0;\n\n    public incrementCounter() {\n        this.currentCount++;\n    }\n}\n";
},"useData":true});
templates['web+angular4/src/main/ts/app/components/counter/counter.component.html'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<h1>Counter</h1>\n\n<p>This is a simple example of an Angular component.</p>\n\n<p>Current count: <strong>{{ currentCount }}</strong></p>\n\n<button (click)=\"incrementCounter()\">Increment</button>\n";
},"useData":true});
templates['web+angular4/src/main/ts/app/components/navmenu/navmenu.component.css'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "li .glyphicon {\n    margin-right: 10px;\n}\n\n/* Highlighting rules for nav menu items */\nli.link-active a,\nli.link-active a:hover,\nli.link-active a:focus {\n    background-color: #4189C7;\n    color: white;\n}\n\n/* Keep the nav menu independent of scrolling and on top of other items */\n.main-nav {\n    position: fixed;\n    top: 0;\n    left: 0;\n    right: 0;\n    z-index: 1;\n}\n\n@media (min-width: 768px) {\n    /* On small screens, convert the nav menu to a vertical sidebar */\n    .main-nav {\n        height: 100%;\n        width: calc(25% - 20px);\n    }\n    .navbar {\n        border-radius: 0px;\n        border-width: 0px;\n        height: 100%;\n    }\n    .navbar-header {\n        float: none;\n    }\n    .navbar-collapse {\n        border-top: 1px solid #444;\n        padding: 0px;\n    }\n    .navbar ul {\n        float: none;\n    }\n    .navbar li {\n        float: none;\n        font-size: 15px;\n        margin: 6px;\n    }\n    .navbar li a {\n        padding: 10px 16px;\n        border-radius: 4px;\n    }\n    .navbar a {\n        /* If a menu item's text is too long, truncate it */\n        width: 100%;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n    }\n}\n";
},"useData":true});
templates['web+angular4/src/main/ts/app/components/navmenu/navmenu.component.ts'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "import { Component } from '@angular/core';\n\n@Component({\n    selector: 'nav-menu',\n    templateUrl: './navmenu.component.html',\n    styleUrls: ['./navmenu.component.css']\n})\nexport class NavMenuComponent {\n}\n";
},"useData":true});
templates['web+angular4/src/main/ts/app/components/navmenu/navmenu.component.html'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class='main-nav'>\n    <div class='navbar navbar-inverse'>\n        <div class='navbar-header'>\n            <button type='button' class='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>\n                <span class='sr-only'>Toggle navigation</span>\n                <span class='icon-bar'></span>\n                <span class='icon-bar'></span>\n                <span class='icon-bar'></span>\n            </button>\n            <a class='navbar-brand' [routerLink]=\"['/home']\">WebApplicationBasic</a>\n        </div>\n        <div class='clearfix'></div>\n        <div class='navbar-collapse collapse'>\n            <ul class='nav navbar-nav'>\n                <li [routerLinkActive]=\"['link-active']\">\n                    <a [routerLink]=\"['/home']\">\n                        <span class='glyphicon glyphicon-home'></span> Home\n                    </a>\n                </li>\n                <li [routerLinkActive]=\"['link-active']\">\n                    <a [routerLink]=\"['/counter']\">\n                        <span class='glyphicon glyphicon-education'></span> Counter\n                    </a>\n                </li>\n                <li [routerLinkActive]=\"['link-active']\">\n                    <a [routerLink]=\"['/fetch-data']\">\n                        <span class='glyphicon glyphicon-th-list'></span> Fetch data\n                    </a>\n                </li>\n            </ul>\n        </div>\n    </div>\n</div>\n";
},"useData":true});
templates['web+angular4/src/main/ts/app/components/fetchdata/fetchdata.component.ts'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "import { Component, Inject } from '@angular/core';\nimport { Http } from '@angular/http';\n\n@Component({\n    selector: 'fetchdata',\n    templateUrl: './fetchdata.component.html'\n})\nexport class FetchDataComponent {\n    public forecasts: WeatherForecast[];\n\n    constructor(http: Http, @Inject('BASE_URL') baseUrl: string) {\n        http.get(baseUrl + 'api/weather-forecasts').subscribe(result => {\n            this.forecasts = result.json() as WeatherForecast[];\n        }, error => console.error(error));\n    }\n}\n\ninterface WeatherForecast {\n    dateFormatted: string;\n    temperatureC: number;\n    temperatureF: number;\n    summary: string;\n}\n";
},"useData":true});
templates['web+angular4/src/main/ts/app/components/fetchdata/fetchdata.component.html'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<h1>Weather forecast</h1>\n\n<p>This component demonstrates fetching data from the server.</p>\n\n<p *ngIf=\"!forecasts\"><em>Loading...</em></p>\n\n<table class='table' *ngIf=\"forecasts\">\n    <thead>\n        <tr>\n            <th>Date</th>\n            <th>Temp. (C)</th>\n            <th>Temp. (F)</th>\n            <th>Summary</th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr *ngFor=\"let forecast of forecasts\">\n            <td>{{ forecast.dateFormatted }}</td>\n            <td>{{ forecast.temperatureC }}</td>\n            <td>{{ forecast.temperatureF }}</td>\n            <td>{{ forecast.summary }}</td>\n        </tr>\n    </tbody>\n</table>\n";
},"useData":true});
templates['web+angular4/src/main/ts/app/components/home/home.component.ts'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "import { Component } from '@angular/core';\n\n@Component({\n    selector: 'home',\n    templateUrl: './home.component.html'\n})\nexport class HomeComponent {\n}\n";
},"useData":true});
templates['web+angular4/src/main/ts/app/components/home/home.component.html'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<h1>Hello, world!</h1>\n<p>Welcome to your new single-page application, built with:</p>\n<ul>\n  <li><a href='http://vertx.io/'>Vert.x</a> for polyglot server-side code</li>\n  <li><a href='https://angular.io/'>Angular</a> and <a href='http://www.typescriptlang.org/'>TypeScript</a> for\n    client-side code\n  </li>\n  <li><a href='https://webpack.github.io/'>Webpack</a> for building and bundling client-side resources</li>\n  <li><a href='http://getbootstrap.com/'>Bootstrap</a> for layout and styling</li>\n</ul>\n<p>To help you get started, we've also set up:</p>\n<ul>\n  <li><strong>Client-side navigation</strong>. For example, click <em>Counter</em> then <em>Back</em> to return here.\n  </li>\n  <li><strong>TODO: Server-side prerendering</strong>. For faster initial loading and improved SEO, your Angular app is\n    prerendered on the server. The resulting HTML is then transferred to the browser where a client-side copy of the app\n    takes over.\n  </li>\n  <li><strong>Webpack dev middleware</strong>. In development mode, there's no need to run the <code>webpack</code>\n    build tool. Your client-side resources are dynamically built on demand. Updates are available as soon as you modify\n    any file.\n  </li>\n  <li><strong>Hot module replacement</strong>. In development mode, you don't even need to reload the page after making\n    most changes. Within seconds of saving changes to files, your Angular app will be rebuilt and a new instance\n    injected is into the page.\n  </li>\n  <li><strong>Efficient production builds</strong>. In production mode, development-time features are disabled, and the\n    <code>webpack</code> build tool produces minified static CSS and JavaScript files.\n  </li>\n</ul>\n";
},"useData":true});
templates['web+angular4/src/main/ts/boot.browser.ts'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "import 'reflect-metadata';\nimport 'zone.js';\nimport 'bootstrap';\nimport { enableProdMode } from '@angular/core';\nimport { platformBrowserDynamic } from '@angular/platform-browser-dynamic';\nimport { AppModule } from './app/app.module.browser';\n\nif (module.hot) {\n    module.hot.accept();\n    module.hot.dispose(() => {\n        // Before restarting the app, we create a new root element and dispose the old one\n        const oldRootElem = document.querySelector('app');\n        const newRootElem = document.createElement('app');\n        oldRootElem!.parentNode!.insertBefore(newRootElem, oldRootElem);\n        modulePromise.then(appModule => appModule.destroy());\n    });\n} else {\n    enableProdMode();\n}\n\n// Note: @ng-tools/webpack looks for the following expression when performing production\n// builds. Don't change how this line looks, otherwise you may break tree-shaking.\nconst modulePromise = platformBrowserDynamic().bootstrapModule(AppModule);\n";
},"useData":true});
templates['web+angular4/package.json'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "  \"description\": \""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.description : stack1), depth0))
    + "\",\n  ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "{\n  \"name\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.name : stack1), depth0))
    + "\",\n  \"version\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.version : stack1), depth0))
    + "\",\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.description : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\"private\": true,\n\n  \"scripts\": {\n    \"test\": \"karma start src/test/ts/karma.conf.js\"\n  },\n  \"dependencies\": {\n    \"@angular/animations\": \"4.2.5\",\n    \"@angular/common\": \"4.2.5\",\n    \"@angular/compiler\": \"4.2.5\",\n    \"@angular/compiler-cli\": \"4.2.5\",\n    \"@angular/core\": \"4.2.5\",\n    \"@angular/forms\": \"4.2.5\",\n    \"@angular/http\": \"4.2.5\",\n    \"@angular/platform-browser\": \"4.2.5\",\n    \"@angular/platform-browser-dynamic\": \"4.2.5\",\n    \"@angular/platform-server\": \"4.2.5\",\n    \"@angular/router\": \"4.2.5\",\n    \"@ngtools/webpack\": \"1.5.0\",\n    \"@types/webpack-env\": \"1.13.0\",\n    \"angular2-template-loader\": \"0.6.2\",\n    \"awesome-typescript-loader\": \"3.2.1\",\n    \"bootstrap\": \"3.3.7\",\n    \"css\": \"2.2.1\",\n    \"css-loader\": \"0.28.4\",\n    \"es6-shim\": \"0.35.3\",\n    \"es6-promise\": \"^4.1.1\",\n    \"event-source-polyfill\": \"0.0.9\",\n    \"expose-loader\": \"0.7.3\",\n    \"extract-text-webpack-plugin\": \"2.1.2\",\n    \"file-loader\": \"0.11.2\",\n    \"html-loader\": \"0.4.5\",\n    \"isomorphic-fetch\": \"2.2.1\",\n    \"jquery\": \"3.2.1\",\n    \"json-loader\": \"0.5.4\",\n    \"preboot\": \"4.5.2\",\n    \"raw-loader\": \"0.5.1\",\n    \"reflect-metadata\": \"0.1.10\",\n    \"rxjs\": \"5.4.2\",\n    \"style-loader\": \"0.18.2\",\n    \"to-string-loader\": \"1.1.5\",\n    \"typescript\": \"2.4.1\",\n    \"url-loader\": \"0.5.9\",\n    \"webpack\": \"2.5.1\",\n    \"webpack-hot-middleware\": \"2.18.2\",\n    \"webpack-merge\": \"4.1.0\",\n    \"zone.js\": \"0.8.12\"\n  },\n  \"devDependencies\": {\n    \"@types/chai\": \"4.0.1\",\n    \"@types/jasmine\": \"2.5.53\",\n    \"chai\": \"4.0.2\",\n    \"jasmine-core\": \"2.6.4\",\n    \"karma\": \"1.7.0\",\n    \"karma-chai\": \"0.1.0\",\n    \"karma-chrome-launcher\": \"2.2.0\",\n    \"karma-cli\": \"1.0.1\",\n    \"karma-jasmine\": \"1.1.0\",\n    \"karma-webpack\": \"2.0.3\",\n    \"webpack-vertx-plugin\": \"0.0.1\"\n  }\n}\n";
},"useData":true});
templates['web+angular4/webpack.config.vendor.js'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "const path = require('path');\nconst webpack = require('webpack');\nconst ExtractTextPlugin = require('extract-text-webpack-plugin');\nconst merge = require('webpack-merge');\nconst treeShakableModules = [\n  '@angular/animations',\n  '@angular/common',\n  '@angular/compiler',\n  '@angular/core',\n  '@angular/forms',\n  '@angular/http',\n  '@angular/platform-browser',\n  '@angular/platform-browser-dynamic',\n  '@angular/router',\n  'zone.js',\n];\nconst nonTreeShakableModules = [\n  'bootstrap',\n  'bootstrap/dist/css/bootstrap.css',\n  'es6-promise',\n  'es6-shim',\n  'event-source-polyfill',\n  'jquery'\n];\nconst allModules = treeShakableModules.concat(nonTreeShakableModules);\n\nmodule.exports = (env) => {\n  const extractCSS = new ExtractTextPlugin('vendor.css');\n  const isDevBuild = !(env && env.prod);\n  const sharedConfig = {\n    stats: {modules: false},\n    resolve: {extensions: ['.js']},\n    module: {\n      rules: [\n        {test: /\\.(png|woff|woff2|eot|ttf|svg)(\\?|$)/, use: 'url-loader?limit=100000'}\n      ]\n    },\n    output: {\n      publicPath: 'dist/',\n      filename: '[name].js',\n      library: '[name]_[hash]'\n    },\n    plugins: [\n      new webpack.ProvidePlugin({$: 'jquery', jQuery: 'jquery'}), // Maps these identifiers to the jQuery package (because Bootstrap expects it to be a global variable)\n      new webpack.ContextReplacementPlugin(/\\@angular\\b.*\\b(bundles|linker)/, path.join(__dirname, 'src', 'main', 'ts')), // Workaround for https://github.com/angular/angular/issues/11580\n      new webpack.ContextReplacementPlugin(/angular(\\\\|\\/)core(\\\\|\\/)@angular/, path.join(__dirname, 'src', 'main', 'ts')), // Workaround for https://github.com/angular/angular/issues/14898\n      new webpack.IgnorePlugin(/^vertx$/) // Workaround for https://github.com/stefanpenner/es6-promise/issues/100\n    ]\n  };\n\n  const clientBundleConfig = merge(sharedConfig, {\n    entry: {\n      // To keep development builds fast, include all vendor dependencies in the vendor bundle.\n      // But for production builds, leave the tree-shakable ones out so the AOT compiler can produce a smaller bundle.\n      vendor: isDevBuild ? allModules : nonTreeShakableModules\n    },\n    output: {path: path.join(__dirname, 'src', 'main', 'resources', 'webroot', 'dist')},\n    module: {\n      rules: [\n        {test: /\\.css(\\?|$)/, use: extractCSS.extract({use: isDevBuild ? 'css-loader' : 'css-loader?minimize'})}\n      ]\n    },\n    plugins: [\n      extractCSS,\n      new webpack.DllPlugin({\n        path: path.join(__dirname, 'src', 'main', 'resources', 'webroot', 'dist', '[name]-manifest.json'),\n        name: '[name]_[hash]'\n      })\n    ].concat(isDevBuild ? [] : [\n      new webpack.optimize.UglifyJsPlugin()\n    ])\n  });\n\n  return [clientBundleConfig];\n};\n";
},"useData":true});
templates['web+angular4/webpack.config.js'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "const path = require('path');\nconst webpack = require('webpack');\nconst merge = require('webpack-merge');\nconst AotPlugin = require('@ngtools/webpack').AotPlugin;\nconst CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;\nconst VertxPlugin = require('webpack-vertx-plugin');\n\nmodule.exports = function (env) {\n  // Configuration in common to both client-side and server-side bundles\n  const isDevBuild = !(env && env.prod);\n  const sharedConfig = {\n    stats: {modules: false},\n    context: __dirname,\n    resolve: {extensions: ['.js', '.ts']},\n    output: {\n      filename: '[name].js',\n      publicPath: 'dist/' // Webpack dev middleware, if enabled, handles requests for this URL prefix\n    },\n    module: {\n      rules: [\n        {\n          test: /\\.ts$/,\n          include: /src\\/.*\\/ts/,\n          use: isDevBuild ? ['awesome-typescript-loader?silent=true', 'angular2-template-loader'] : '@ngtools/webpack'\n        },\n        {test: /\\.html$/, use: 'html-loader?minimize=false'},\n        {test: /\\.css$/, use: ['to-string-loader', isDevBuild ? 'css-loader' : 'css-loader?minimize']},\n        {test: /\\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000'}\n      ]\n    },\n    plugins: [new CheckerPlugin()]\n  };\n\n  // Configuration for client-side bundle suitable for running in browsers\n  const clientBundleOutputDir = './src/main/resources/webroot/dist';\n  const clientBundleConfig = merge(sharedConfig, {\n    entry: {'main-client': './src/main/ts/boot.browser.ts'},\n    output: {path: path.join(__dirname, clientBundleOutputDir)},\n    plugins: [\n      new webpack.DllReferencePlugin({\n        context: __dirname,\n        manifest: require('./src/main/resources/webroot/dist/vendor-manifest.json')\n      })\n    ].concat(isDevBuild ? [\n      // Plugins that apply in development builds only\n      new webpack.SourceMapDevToolPlugin({\n        filename: '[file].map', // Remove this line if you prefer inline source maps\n        moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk\n      }),\n      new VertxPlugin()\n    ] : [\n      // Plugins that apply in production builds only\n      new webpack.optimize.UglifyJsPlugin(),\n      new AotPlugin({\n        tsConfigPath: './tsconfig.json',\n        entryModule: path.join(__dirname, 'src', 'main', 'ts', 'app', 'app.module.browser#AppModule'),\n        exclude: ['./**/*.server.ts']\n      }),\n      new VertxPlugin()\n    ])\n  });\n\n  return [clientBundleConfig];\n};\n";
},"useData":true});
templates['gradle/build.gradle'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "    classpath 'org.jetbrains.kotlin:kotlin-gradle-plugin:1.1.0'\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "apply plugin: 'kotlin'\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "description = '"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.description : stack1), depth0))
    + "'\n";
},"7":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "  compile '"
    + alias2(alias1((depth0 != null ? depth0.groupId : depth0), depth0))
    + ":"
    + alias2(alias1((depth0 != null ? depth0.artifactId : depth0), depth0))
    + ":"
    + alias2(alias1((depth0 != null ? depth0.version : depth0), depth0))
    + "'\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=container.lambda, alias3=container.escapeExpression;

  return "buildscript {\n  repositories {\n    mavenCentral()\n    jcenter()\n  }\n\n  dependencies {\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.kotlin : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    classpath 'com.github.jengelman.gradle.plugins:shadow:1.2.4'\n  }\n}\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.kotlin : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "apply plugin: 'java'\napply plugin: 'application'\napply plugin: 'com.github.johnrengelman.shadow'\n\nrepositories {\n  mavenCentral()\n}\n\nversion = '"
    + alias3(alias2(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.version : stack1), depth0))
    + "'\ngroup = '"
    + alias3(alias2(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.groupId : stack1), depth0))
    + "'\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.description : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "sourceCompatibility = '1.8'\nmainClassName = 'io.vertx.core.Launcher'\n\ndependencies {\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.selectedDependencies : depth0),{"name":"each","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "}\n\nshadowJar {\n  classifier = 'fat'\n  manifest {\n    attributes 'Main-Verticle': '"
    + alias3(alias2(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.packageName : stack1), depth0))
    + ".MainVerticle'\n  }\n  mergeServiceFiles {\n    include 'META-INF/services/io.vertx.core.spi.VerticleFactory'\n  }\n}\n\ntask wrapper(type: Wrapper) {\n  gradleVersion = '2.13'\n}\n";
},"useData":true});
templates['gradle/.gitignore'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "# build files\nbuild\n# runtime files\n.vertx\n";
},"useData":true});
templates['gradle/src/main/resources/main.rb'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "# your code goes here...\n$vertx.create_http_server().request_handler() { |req|\n  req.response().put_header(\"content-type\", \"text/html\").end(\"<html><body><h1>Hello from vert.x!</h1></body></html>\")\n}.listen(8080)\n";
},"useData":true});
templates['gradle/src/main/resources/main.groovy'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "// your code goes here...\nvertx.createHttpServer().requestHandler({ req ->\n  req.response().putHeader(\"content-type\", \"text/html\").end(\"<html><body><h1>Hello from vert.x!</h1></body></html>\")\n}).listen(8080)\n";
},"useData":true});
templates['gradle/src/main/java/MainVerticle.java'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "package "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.packageName : stack1), depth0))
    + ";\n\nimport io.vertx.core.AbstractVerticle;\n\npublic class MainVerticle extends AbstractVerticle {\n\n  @Override\n  public void start() {\n    // your code goes here...\n    vertx.createHttpServer().requestHandler(req -> {\n      req.response()\n        .putHeader(\"content-type\", \"text/plain\")\n        .end(\"Hello from Vert.x!\");\n    }).listen(8080);\n  }\n}\n";
},"useData":true});
templates['gradle/src/main/kotlin/MainVerticle.kt'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "package "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.metadata : depth0)) != null ? stack1.packageName : stack1), depth0))
    + "\n\nimport io.vertx.core.AbstractVerticle\n\nclass MainVerticle : AbstractVerticle() {\n\n  override fun start() {\n    // your code goes here...\n    vertx.createHttpServer().requestHandler({ req ->\n      req.response()\n        .putHeader(\"content-type\", \"text/plain\")\n        .end(\"Hello from Vert.x!\")\n    }).listen(8080)\n  }\n}\n";
},"useData":true});
})();
