# Vert.x Stack Project

A project build using [Stack Manager](http://vertx.io/docs/vertx-stack-manager/stack-manager/).

## Usage

### With existing stack

Given that you already have [downloaded](http://vertx.io/download/) one distribution to your local environment, copy the `vertx-stack.json` file to your `$VERTX_HOME` and run:

```
vertx resolve --dir=lib
```

### Without existing stack

In order to boostrap the first stack you can use the provided maven pom.

```
maven package
```

## More information

For further information please read the documentation on [Stack Manager](http://vertx.io/docs/vertx-stack-manager/stack-manager/).
