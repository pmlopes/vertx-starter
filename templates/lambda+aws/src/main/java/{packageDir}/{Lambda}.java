package {{ metadata.package }};

import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;
import xyz.jetdrone.vertx.lambda.aws.Lambda;
import xyz.jetdrone.vertx.lambda.aws.event.APIGatewayProxyRequest;
import xyz.jetdrone.vertx.lambda.aws.event.APIGatewayProxyResponse;

/**
 * You can use a Lambda function to process requests from an Application Load Balancer.
 *
 * Elastic Load Balancing supports Lambda functions as a target for an Application Load Balancer.
 * Use load balancer rules to route HTTP requests to a function, based on path or header values.
 * Process the request and return an HTTP response from your Lambda function.
 *
 * Elastic Load Balancing invokes your Lambda function synchronously with an event that contains
 * the request body and metadata.
 */
public class {{ metadata.Lambda }} implements Lambda<JsonObject> {

  @Override
  public void handle(Message<JsonObject> event) {
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
