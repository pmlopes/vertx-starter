import sbt.Keys._
import sbt._

object Build extends AutoPlugin {

  override def trigger = allRequirements

  override def projectSettings =
    Vector(
      resolvers ++= Vector(
        "Sonatype SNAPSHOTS" at "https://oss.sonatype.org/content/repositories/snapshots/"
      ),
      scalaVersion := Version.Scala,
      scalacOptions ++= Vector(
        "-unchecked",
        "-deprecation",
        "-language:_",
        "-target:jvm-1.8",
        "-encoding", "UTF-8"
      ),
      mainClass := Some("io.vertx.core.Launcher"),
      unmanagedSourceDirectories in Compile := Vector(scalaSource.in(Compile).value),
      unmanagedSourceDirectories in Test := Vector(scalaSource.in(Test).value),
      initialCommands in console := """|import io.vertx.lang.scala._
                                       |import io.vertx.scala.core._
                                       |import io.vertx.scala.sbt._
                                       |import scala.concurrent.Future
                                       |import scala.concurrent.Promise
                                       |import scala.util.Success
                                       |import scala.util.Failure
                                       |val vertx = Vertx.vertx
                                       |implicit val executionContext = io.vertx.lang.scala.VertxExecutionContext(vertx.getOrCreateContext)
                                       |""".stripMargin
    )
}
