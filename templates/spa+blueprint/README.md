# {{metadata.name}}

This is your SPA blueprint project. Ensure you have [node](https://www.nodejs.org) installed
on your path.

## Build

This project is composed of 2 parts:

1. a SPA application under the folder: `*-clientapp/`
2. a Vert.x application

### SPA Build

```sh
cd *-clientapp
npm install
```

For optimized (**Production**) builds:

```sh
npm run build
```

The output of the build will automatically be included in the final vert.x application.

### Vert.x Build

```sh
mvn clean package
```

If you want to include the SPA application with your final build, run the previous build step as:

```sh
cd *-clientapp
npm install
npm run build
```

## Development

During development you can benefit from hot reload both on the SPA and on Vert.x:

```sh
VERTX_ENVIRONMENT=dev mvn compile vertx:run
```

In this case, the SPA utilities will launch the SPA dev server and redirect all traffic to the devserver.

The devserver will then proxy only the API calls to the vert.x application.

Changing the js source code will trigger the hot reload of the SPA framework.

Changing any maven related project will trigger a reload of the vert.x app.

For more information see [vertx-maven-plugin](https://reactiverse.io/vertx-maven-plugin/).

## Build

Just use the plugin:

```sh
mvn clean package
```
