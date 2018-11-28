# OpenAPI Server with Event Bus Services

This generator creates a web server using an OpenAPI specification and generates service interfaces for [vertx-web-api-contract](https://vertx.io/docs/vertx-web-api-contract/java/). Please look at the documentation of [vertx-web-api-codegen](https://vertx.io/docs/vertx-web-api-codegen/java/)

## Specify service names

To Specify service names you have two alternatives:

* In every operation fill the `x-vertx-event-bus.class` with service interface name. For example:

```yaml
paths:
  /anOperation:
    get:
      operationId: anOperation
      x-vertx-event-bus:
        address: my_service.myapp
        class: MyService
```

* Create a map under `components.x-vertx-service-gen` with service addresses as keys and service interface names as values, then put as usual `x-vertx-event-bus` inside every operation to specify the address. For example:

```yaml
paths:
  /anOperation:
    get:
      operationId: anOperation
      x-vertx-event-bus: my_service.myapp
components:
  x-vertx-service-gen:
    "my_service.myapp": MyService
    "another_service.myapp": AnotherService
```