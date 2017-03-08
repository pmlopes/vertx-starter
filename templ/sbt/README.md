#Getting vertx-lang-scala

The current version in master is deployed as SNAPSHOTS in a sonatype repo (which is the default one configured fir this build)

#Work with this project

Create a runnable fat-jar
```
sbt assembly
```

play around in sbt
```
sbt
> console
scala> vertx.deployVerticle(s"scala:${classOf[DemoVerticle].getName}")
scala> vertx.deploymentIDs
```

From here you can freely interact with the Vertx-API inside the sbt-scala-shell.