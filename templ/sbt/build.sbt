import sbt.Package._

lazy val `vertx-scala-sbt` = project
  .in(file("."))

version := "0.1-SNAPSHOT"
name := "vertx-scala-sbt"
organization := "io.vertx"
scalaVersion := "2.12.0"

libraryDependencies ++= Vector (
{{#each selectedDependencies}}
  Library.{{artifactId}},
{{/each}}
  Library.scalaTest       % "test"
)

packageOptions += ManifestAttributes(
  ("Main-Verticle", "scala:io.vertx.scala.sbt.DemoVerticle"))

initialCommands := """|import io.vertx.lang.scala._
                     |import io.vertx.scala.core._
                     |import io.vertx.scala.sbt._
                     |import scala.concurrent.Future
                     |import scala.concurrent.Promise
                     |import scala.util.Success
                     |import scala.util.Failure
                     |val vertx = Vertx.vertx
                     |implicit val executionContext = io.vertx.lang.scala.VertxExecutionContext(vertx.getOrCreateContext)
                     |""".stripMargin
