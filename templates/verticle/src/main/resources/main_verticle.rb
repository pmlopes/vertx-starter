{{#containsDep dependencies "io.vertx" "vertx-web"}}
require 'vertx-web/router'
{{/containsDep}}

# your code goes here...

{{#containsDep dependencies "io.vertx" "vertx-web"}}
router = VertxWeb::Router.router($vertx)

router.get("/").handler() { |ctx|
  ctx.response()
    .putHeader("content-type", "text/plain")
    .end("Hello from Vert.x!")
}
{{/containsDep}}

http_server = $vertx.create_http_server()

http_server.request_handler({{#containsDep dependencies "io.vertx" "vertx-web"}}&router.method(:accept)){{else}}) { |req|
  req.response()
    .putHeader("content-type", "text/plain")
    .end("Hello from Vert.x!")
}{{/containsDep}}

http_server.listen(8080) { |res_err,res|
  if (res_err != nil)
    res_err.print_stack_trace()
  else
    puts "Server listening at: http://localhost:8080/"
  end
}
