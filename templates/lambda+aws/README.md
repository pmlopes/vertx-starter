# aws-lambda-vertx-native

### Custom Vert.x Native for AWS Lambda

*Disclaimer - This project should be considered a POC and has not been tested or verified for production use.
If you decided to run this on production systems you do so at your own risk.*

### Building this Runtime


#### Prerequisites

Make sure you have the following installed on your build machine before getting started.

* GraalVM
* AWS CLI

##### Compile the Runtime Classes

```
$ ./mvnw package
```

If your system cannot build working images (say to mismatch of library versions), you can build under docker.

### Deploying to AWS Lambda

#### Create a lambda role

```
aws iam create-role \
    --role-name lambda-role \
    --path "/service-role/" \
    --assume-role-policy-document file:///tmp/trust-policy.json
```

Where the file `/tmp/trust-policy.json` contains:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

#### Create a function

```
aws lambda delete-function --function-name vertxNativeTester

aws lambda create-function --function-name vertxNativeTester \
    --zip-file fileb://target/lambda-0.0.1-SNAPSHOT-function.zip --handler lambda.ApplicationLoadBalancerLambda --runtime provided \
    --role arn:aws:iam::985727241951:role/service-role/lambda-role
```

#### Test it

```
aws lambda invoke --function-name vertxNativeTester  --payload '{"message":"Hello World"}' --log-type Tail response.txt | grep "LogResult"| awk -F'"' '{print $4}' | base64 --decode
```
