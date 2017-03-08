//import org.scalafmt.sbt.ScalaFmtPlugin
import sbt.Keys._
import sbt._
import sbtassembly.AssemblyPlugin.autoImport._
import sbtassembly.PathList

object Build extends AutoPlugin {

  override def trigger = allRequirements

  override def projectSettings =
    Vector(
      resolvers ++= Seq {
        "Sonatype SNAPSHOTS" at "https://oss.sonatype.org/content/repositories/snapshots/"
      },
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
      assemblyMergeStrategy in assembly := {
        case PathList("META-INF", "MANIFEST.MF") => MergeStrategy.discard
        case PathList("META-INF", xs @ _*) => MergeStrategy.last
        case PathList("META-INF", "io.netty.versions.properties") => MergeStrategy.last
        case PathList("codegen.json") => MergeStrategy.discard
        case x =>
          val oldStrategy = (assemblyMergeStrategy in assembly).value
          oldStrategy(x)
      }
    )
}
