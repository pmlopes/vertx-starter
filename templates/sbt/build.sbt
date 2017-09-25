import sbt.Package._
import sbt._

scalaVersion := "2.12.1"

libraryDependencies ++= Seq(
  {{#each selectedDependencies}}
  {{#if core}}
  "{{groupId}}" % "{{artifactId}}" % "{{version}}"{{#unless @last}},{{/unless}}
  {{else}}
  "{{groupId}}" % "{{artifactId}}{{../metadata.artifactSuffix}}" % "{{version}}"{{#unless @last}},{{/unless}}
  {{/if}}
  {{/each}}
)

packageOptions += ManifestAttributes(
  ("Main-Verticle", "scala:{{metadata.packageName}}.MainVerticle"))

assemblyMergeStrategy in assembly := {
  case PathList("META-INF", "MANIFEST.MF") => MergeStrategy.discard
  case PathList("META-INF", xs @ _*) => MergeStrategy.last
  case PathList("META-INF", "io.netty.versions.properties") => MergeStrategy.last
  case PathList("codegen.json") => MergeStrategy.discard
  case x =>
    val oldStrategy = (assemblyMergeStrategy in assembly).value
    oldStrategy(x)
}
