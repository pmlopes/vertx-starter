# {{metadata.name}}

This is your empty project. Ensure you have [GraalVM](https://www.graalvm.org) installed
on your path or use the provided `Dockerfile` to build your image.

## Build

`mvn package`

or

`docker build -t {{metadata.name}} .`

## Run

`./target/{{lowerCase metadata.main}}`

or

`docker run --rm -it --net=host {{metadata.name}}`
