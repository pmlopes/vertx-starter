import sbt.Package._
import sbt._
import Docker.autoImport.exposedPorts

scalaVersion := "2.12.7"

enablePlugins(DockerPlugin)
exposedPorts := Seq(8666)

libraryDependencies ++= Vector (
  {{#each dependencies}}
  {{#if core}}
  "{{groupId}}" % "{{artifactId}}" % "{{version}}"{{#if classifier}} % "{{classifier}}"{{/if}},
  {{else}}
  "{{groupId}}" % "{{artifactId}}{{#if stack}}{{../metadata.artifactSuffix}}{{/if}}" % "{{version}}"{{#if classifier}} % "{{classifier}}"{{/if}},
  {{/if}}
  {{/each}}
  "io.vertx" % "vertx-codegen" % "{{metadata.bom}}" % "provided",
  "org.scalatest" %% "scalatest" % "3.0.1"
)

packageOptions += ManifestAttributes(
  ("Main-Verticle", "scala:{{metadata.package}}.MainVerticle"))
