import sbt._

object Version {
  final val Scala       = "2.12.1"
  final val ScalaTest   = "3.0.1"
  final val Vertx       = "3.4.0"
}

object Library {
  //required to get rid of some warnings emitted by the scala-compile
  val vertxCodegen   = "io.vertx"       %  "vertx-codegen"    % Version.Vertx     % "provided"
  val vertxLangScala = "io.vertx"       %% "vertx-lang-scala" % Version.Vertx
  val vertxWeb       = "io.vertx"       %% "vertx-web-scala"  % Version.Vertx
  val scalaTest      = "org.scalatest"  %% "scalatest"        % Version.ScalaTest
}