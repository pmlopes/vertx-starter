# {{metadata.name}}

This is your SPA blueprint project. Ensure you have [node](https://www.nodejs.org) installed
on your path. And optionally [GraalVM](https://www.graalvm.org).

## Build

Run your package manager tool to install the required dependencies:

```sh
npm install
```

or

```sh
yarn install
```

From now on will assume you're using `NPM`.

### Run

```sh
npm start
```

In case you need to use `>ES5.1` features you **MUST** run on GraalVM.

### Packaging

The project can be packaged into a container. For this run:

```sh
npm run dockerfile
```

This step will create the basic `Dockerfile` required to run your application. By default it will use the GraalVM image
but you're not required to. The best options are either `GraalVM` or `JDK >=11`.


```sh
docker build -t yourtag:your-version .
```

And run the container as:

```sh
docker run --rm --net=host yourtag:your-version
```

Any arguments after the image name will be passed to the application, this allows the customization of the start command, for example `--cluster` will start the application in a `vert.x` cluster.
