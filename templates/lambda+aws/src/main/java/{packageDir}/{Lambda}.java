package {{ metadata.package }};

import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;
import xyz.jetdrone.vertx.lambda.Lambda;
import xyz.jetdrone.vertx.lambda.aws.event.*;

/**
 * You can use a Lambda function to process any kind of events.
 * AWS Lambda sends events as JSON messages so it is convenient
 * to let use the generified interface.
 *
 * As a utility helper most events can be converted to POJOs
 * by using the provided implementations under the <pre>event</pre>
 * package.
 */
public class {{ metadata.Lambda }} implements Lambda<JsonObject> {

  @Override
  public void handle(Message<JsonObject> event) {
    // assuming this lambda will handle API GW Proxy requests...

    // the payload should be a proxy request
    APIGatewayProxyRequest req = new APIGatewayProxyRequest(event.body());

    // print the payload
    System.out.println(req);

    // Here your business logic...

    event.reply(
      new APIGatewayProxyResponse()
        .setStatusCode(200)
        .setIsBase64Encoded(false)
        .setHeaders(new JsonObject()
            .put("Content-Type", "text/html"))
        .setBody("<h1>Hello from Lambda!</h1>")
      // convert to JSON as it's the expected format by lambda
      .toJson());
  }
}
