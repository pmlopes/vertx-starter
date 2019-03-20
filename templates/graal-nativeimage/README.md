# {{metadata.name}}

This is your empty project. Ensure you have [GraalVM](https://www.graalvm.org) installed
on your path or use the provided `Dockerfile` to build your image.

**WARNING**: If you need to add more verticles to your application (so it can run them using
the standard `java -jar ... run your.other.Verticle`) you need to list it on:

[src/main/resources/META-INF/native-image/{{metadata.groupId}}/{{metadata.artifactId}}/reflection.json](src/main/resources/META-INF/native-image/{{metadata.groupId}}/{{metadata.artifactId}}/reflection.json)


## Build

`mvn package`

or

`docker build -t {{metadata.name}} .`

## Run

`./target/{{metadata.name}}`

or

`docker run --rm -it --net=host {{metadata.name}}`
