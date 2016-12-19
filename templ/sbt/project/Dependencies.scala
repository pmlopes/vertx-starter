import sbt._

object Version {
  final val Scala       = "2.12.0"
  final val ScalaTest   = "3.0.0"
}

object Library {
{{#each selectedDependencies}}
  val {{artifactId}}   = "{{groupId}}"  %  "{{artifactId}}"  %  "{{version}}" {{#if provided}} % "{{provided}}" {{/if}}  changing()
{{/each}}
  val scalaTest      = "org.scalatest"  %% "scalatest"        % Version.ScalaTest              changing()
}
