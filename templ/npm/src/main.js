// your code goes here...
vertx.createHttpServer()
  .requestHandler(function (req) {
    req.response()
      .putHeader("content-type", "text/plain")
      .end("Hello from Vert.x!");
}).listen(8080);

console.log('Listening at http://127.0.0.1:8080');
