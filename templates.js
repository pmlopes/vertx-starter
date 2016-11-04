(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['maven/.gitignore'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "# build files\ntarget\n# runtime files\n.vertx\n";
},"useData":true});
templates['maven/src/main/java/.java'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "package "
    + alias4(((helper = (helper = helpers.packageName || (depth0 != null ? depth0.packageName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"packageName","hash":{},"data":data}) : helper)))
    + ";\n\nimport io.vertx.core.AbstractVerticle;\n\npublic class "
    + alias4(((helper = (helper = helpers.className || (depth0 != null ? depth0.className : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"className","hash":{},"data":data}) : helper)))
    + " extends AbstractVerticle {\n\n  @Override\n  public void start() {\n    // TODO: your code goes here...\n  }\n}\n";
},"useData":true});
templates['maven/pom.xml'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <dependency>\n      <groupId>"
    + alias4(((helper = (helper = helpers.groupId || (depth0 != null ? depth0.groupId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"groupId","hash":{},"data":data}) : helper)))
    + "</groupId>\n      <artifactId>"
    + alias4(((helper = (helper = helpers.artifactId || (depth0 != null ? depth0.artifactId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"artifactId","hash":{},"data":data}) : helper)))
    + "</artifactId>\n      <version>"
    + alias4(((helper = (helper = helpers.version || (depth0 != null ? depth0.version : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"version","hash":{},"data":data}) : helper)))
    + "</version>\n    </dependency>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<project xmlns=\"http://maven.apache.org/POM/4.0.0\"\n         xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n         xsi:schemaLocation=\"http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd\">\n\n  <modelVersion>4.0.0</modelVersion>\n\n  <groupId>"
    + alias4(((helper = (helper = helpers.groupId || (depth0 != null ? depth0.groupId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"groupId","hash":{},"data":data}) : helper)))
    + "</groupId>\n  <artifactId>"
    + alias4(((helper = (helper = helpers.artifactId || (depth0 != null ? depth0.artifactId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"artifactId","hash":{},"data":data}) : helper)))
    + "</artifactId>\n  <version>"
    + alias4(((helper = (helper = helpers.version || (depth0 != null ? depth0.version : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"version","hash":{},"data":data}) : helper)))
    + "</version>\n\n  <name>"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</name>\n  <description>"
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "</description>\n\n  <properties>\n    <main.verticle>"
    + alias4(((helper = (helper = helpers.main || (depth0 != null ? depth0.main : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"main","hash":{},"data":data}) : helper)))
    + "</main.verticle>\n  </properties>\n\n  <dependencies>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.dependencies : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  </dependencies>\n\n  <build>\n    <pluginManagement>\n      <plugins>\n        <plugin>\n          <artifactId>maven-compiler-plugin</artifactId>\n          <version>3.1</version>\n          <configuration>\n            <source>1.8</source>\n            <target>1.8</target>\n          </configuration>\n        </plugin>\n      </plugins>\n    </pluginManagement>\n\n    <plugins>\n      <plugin>\n        <groupId>org.apache.maven.plugins</groupId>\n        <artifactId>maven-shade-plugin</artifactId>\n        <version>2.3</version>\n        <executions>\n          <execution>\n            <phase>package</phase>\n            <goals>\n              <goal>shade</goal>\n            </goals>\n            <configuration>\n              <transformers>\n                <transformer implementation=\"org.apache.maven.plugins.shade.resource.ManifestResourceTransformer\">\n                  <manifestEntries>\n                    <Main-Class>io.vertx.core.Launcher</Main-Class>\n                    <Main-Verticle>${main.verticle}</Main-Verticle>\n                  </manifestEntries>\n                </transformer>\n                <transformer implementation=\"org.apache.maven.plugins.shade.resource.AppendingTransformer\">\n                  <resource>META-INF/services/io.vertx.core.spi.VerticleFactory</resource>\n                </transformer>\n              </transformers>\n              <artifactSet>\n              </artifactSet>\n              <outputFile>${project.build.directory}/${project.artifactId}-${project.version}-fat.jar</outputFile>\n            </configuration>\n          </execution>\n        </executions>\n      </plugin>\n    </plugins>\n  </build>\n</project>\n";
},"useData":true});
templates['gradle/.gitignore'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "# build files\nbuild\n# runtime files\n.vertx\n";
},"useData":true});
templates['gradle/src/main/java/.java'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "package "
    + alias4(((helper = (helper = helpers.packageName || (depth0 != null ? depth0.packageName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"packageName","hash":{},"data":data}) : helper)))
    + ";\n\nimport io.vertx.core.AbstractVerticle;\n\npublic class "
    + alias4(((helper = (helper = helpers.className || (depth0 != null ? depth0.className : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"className","hash":{},"data":data}) : helper)))
    + " extends AbstractVerticle {\n\n  @Override\n  public void start() {\n    // TODO: your code goes here...\n  }\n}\n";
},"useData":true});
templates['gradle/build.gradle'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "  compile '"
    + alias4(((helper = (helper = helpers.groupId || (depth0 != null ? depth0.groupId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"groupId","hash":{},"data":data}) : helper)))
    + ":"
    + alias4(((helper = (helper = helpers.artifactId || (depth0 != null ? depth0.artifactId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"artifactId","hash":{},"data":data}) : helper)))
    + ":"
    + alias4(((helper = (helper = helpers.version || (depth0 != null ? depth0.version : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"version","hash":{},"data":data}) : helper)))
    + "'\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "plugins {\n  id 'java'\n  id 'application'\n  id 'com.github.johnrengelman.shadow' version '1.2.3'\n}\n\nrepositories {\n  mavenCentral()\n}\n\nversion = '"
    + alias4(((helper = (helper = helpers.version || (depth0 != null ? depth0.version : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"version","hash":{},"data":data}) : helper)))
    + "'\ndescription = '"
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "'\nsourceCompatibility = '1.8'\nmainClassName = 'io.vertx.core.Launcher'\n\ndependencies {\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.dependencies : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "}\n\nshadowJar {\n  classifier = 'fat'\n  manifest {\n    attributes 'Main-Verticle': '"
    + alias4(((helper = (helper = helpers.main || (depth0 != null ? depth0.main : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"main","hash":{},"data":data}) : helper)))
    + "'\n  }\n  mergeServiceFiles {\n    include 'META-INF/services/io.vertx.core.spi.VerticleFactory'\n  }\n}\n\ntask wrapper(type: Wrapper) {\n  gradleVersion = '2.8'\n}\n";
},"useData":true});
templates['npm/.gitignore'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "# temp files\npom.xml\n# build files\ntarget\nnode_modules\n# compiled file (your app)\nserver.js\n# runtime files\n.vertx\nrun.jar\n";
},"useData":true});
templates['npm/src/main.js'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "// TODO: your application code goes here...\n";
},"useData":true});
templates['npm/package.json'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    \""
    + alias4(((helper = (helper = helpers.groupId || (depth0 != null ? depth0.groupId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"groupId","hash":{},"data":data}) : helper)))
    + ":"
    + alias4(((helper = (helper = helpers.artifactId || (depth0 != null ? depth0.artifactId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"artifactId","hash":{},"data":data}) : helper)))
    + "\": \""
    + alias4(((helper = (helper = helpers.version || (depth0 != null ? depth0.version : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"version","hash":{},"data":data}) : helper)))
    + "\""
    + ((stack1 = helpers.unless.call(alias1,(data && data.last),{"name":"unless","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"2":function(container,depth0,helpers,partials,data) {
    return ",";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "{\n  \"name\": \""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\",\n  \"version\": \""
    + alias4(((helper = (helper = helpers.version || (depth0 != null ? depth0.version : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"version","hash":{},"data":data}) : helper)))
    + "\",\n  \"description\": \""
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "\",\n\n  \"mainVerticle\": \""
    + alias4(((helper = (helper = helpers.main || (depth0 != null ? depth0.main : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"main","hash":{},"data":data}) : helper)))
    + "\",\n\n  \"scripts\": {\n    \"install\": \"node ./webpack.config.js\",\n    \"postinstall\": \"mvn clean package\",\n\n    \"build\": \"./node_modules/.bin/webpack\",\n    \"build:release\": \"./node_modules/.bin/webpack -p\",\n\n    \"prestart\": \"./node_modules/.bin/webpack\",\n    \"start\": \"java -jar run.jar\",\n\n    \"watch\": \"npm run start -- --redeploy=\\\"src/**\\\" --on-redeploy=\\\"npm run watch\\\"\"\n  },\n\n  \"dependencies\": {\n  },\n\n  \"devDependencies\": {\n    \"babel-core\": \"^6.5.1\",\n    \"babel-loader\": \"^6.2.2\",\n    \"babel-preset-es2015\": \"^6.5.0\",\n    \"webpack\": \"^1.12.13\"\n  },\n\n  \"javaDependencies\": {\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.dependencies : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  }\n}\n";
},"useData":true});
templates['npm/webpack.config.js'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "var _package = require('./package.json');\nvar fs = require('fs');\nvar path = require('path');\n\nif ('install' === process.env.npm_lifecycle_event) {\n  // generate pom.xml file\n  var javaDependencies = _package.javaDependencies || {};\n  var pom =\n    '<?xml version=\"1.0\" encoding=\"UTF-8\"?>\\n' +\n    '<project xmlns=\"http://maven.apache.org/POM/4.0.0\"\\n' +\n    '         xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\\n' +\n    '         xsi:schemaLocation=\"http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd\">\\n' +\n    '\\n' +\n    '  <modelVersion>4.0.0</modelVersion>\\n' +\n    '  <packaging>pom</packaging>\\n' +\n    '\\n' +\n    '  <groupId>' + _package.name + '</groupId>\\n' +\n    '  <artifactId>' + _package.name + '</artifactId>\\n' +\n    '  <version>' + _package.version + '</version>\\n' +\n    '\\n' +\n    '  <name>' + _package.name + '</name>\\n' +\n    '  <description>' + (_package.description || '') + '</description>\\n' +\n    '\\n' +\n    '  <dependencies>\\n';\n\n\n  for (dep in javaDependencies) {\n    if (javaDependencies.hasOwnProperty(dep)) {\n      pom +=\n        '    <dependency>\\n' +\n        '      <groupId>' + dep.split(':')[0] + '</groupId>\\n' +\n        '      <artifactId>' + dep.split(':')[1] + '</artifactId>\\n' +\n        '      <version>' + javaDependencies[dep] + '</version>\\n' +\n        '    </dependency>\\n';\n    }\n  }\n\n  pom +=\n    '  </dependencies>\\n' +\n    '\\n' +\n    '  <build>\\n' +\n    '    <plugins>\\n' +\n    '      <plugin>\\n' +\n    '        <groupId>org.apache.maven.plugins</groupId>\\n' +\n    '        <artifactId>maven-dependency-plugin</artifactId>\\n' +\n    '        <version>2.10</version>\\n' +\n    '        <executions>\\n' +\n    '          <execution>\\n' +\n    '            <id>unpack-dependencies</id>\\n' +\n    '            <phase>package</phase>\\n' +\n    '            <goals>\\n' +\n    '              <goal>unpack-dependencies</goal>\\n' +\n    '            </goals>\\n' +\n    '            <configuration>\\n' +\n    '              <includes>**/*.js</includes>\\n' +\n    '              <outputDirectory>${project.basedir}/node_modules</outputDirectory>\\n' +\n    '              <overWriteReleases>false</overWriteReleases>\\n' +\n    '              <overWriteSnapshots>true</overWriteSnapshots>\\n' +\n    '            </configuration>\\n' +\n    '          </execution>\\n' +\n    '        </executions>\\n' +\n    '      </plugin>\\n' +\n    '      <plugin>\\n' +\n    '        <groupId>org.apache.maven.plugins</groupId>\\n' +\n    '        <artifactId>maven-shade-plugin</artifactId>\\n' +\n    '        <version>2.3</version>\\n' +\n    '        <executions>\\n' +\n    '          <execution>\\n' +\n    '            <phase>package</phase>\\n' +\n    '            <goals>\\n' +\n    '              <goal>shade</goal>\\n' +\n    '            </goals>\\n' +\n    '            <configuration>\\n' +\n    '              <transformers>\\n' +\n    '                <transformer implementation=\"org.apache.maven.plugins.shade.resource.ManifestResourceTransformer\">\\n' +\n    '                  <manifestEntries>\\n' +\n    '                    <Main-Class>io.vertx.core.Launcher</Main-Class>\\n' +\n    '                    <Main-Verticle>' + _package.mainVerticle + '</Main-Verticle>\\n' +\n    '                  </manifestEntries>\\n' +\n    '                </transformer>\\n' +\n    '                <transformer implementation=\"org.apache.maven.plugins.shade.resource.AppendingTransformer\">\\n' +\n    '                  <resource>META-INF/services/io.vertx.core.spi.VerticleFactory</resource>\\n' +\n    '                </transformer>\\n' +\n    '              </transformers>\\n' +\n    '              <outputFile>${project.basedir}/run.jar</outputFile>\\n' +\n    '            </configuration>\\n' +\n    '          </execution>\\n' +\n    '        </executions>\\n' +\n    '      </plugin>\\n' +\n    '    </plugins>\\n' +\n    '  </build>\\n' +\n    '</project>\\n';\n\n  // generate pom.xml\n  fs.writeFile(path.resolve(__dirname, 'pom.xml'), pom, function (err) {\n    if (err) {\n      console.error(err);\n      process.exit(1);\n    }\n  });\n}\n\nmodule.exports = {\n\n  entry: path.resolve(__dirname, 'src/main.js'),\n\n  output: {\n    filename: _package.mainVerticle\n  },\n\n  module: {\n    loaders: [\n      {test: /\\.js$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015'}\n    ]\n  }\n};\n";
},"useData":true});
})();
