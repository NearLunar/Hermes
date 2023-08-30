import { GoFunction } from "@aws-cdk/aws-lambda-go-alpha";
import * as cdk from "aws-cdk-lib";
import { LogGroupLogDestination, RestApi } from "aws-cdk-lib/aws-apigateway";
import { NagSuppressions } from "cdk-nag";
import { type Construct } from "constructs";
import path from "path";

export class HermesStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create Access Log Group
        const accessLogGroup = new cdk.aws_logs.LogGroup(
            this,
            "HermesAccessLogGroup",
            {
                logGroupName: "/aws/apigateway/hermes",
                removalPolicy: cdk.RemovalPolicy.DESTROY,
                retention: cdk.aws_logs.RetentionDays.ONE_WEEK,
            },
        );

        // Create a new API Gateway
        const apiGateway = new RestApi(this, "HermesApi", {
            cloudWatchRole: true,
            deployOptions: {
                loggingLevel: cdk.aws_apigateway.MethodLoggingLevel.INFO,
                accessLogDestination: new LogGroupLogDestination(
                    accessLogGroup,
                ),
            },
        });

        // Create Link Lambda Function
        const createLinkLambda = new GoFunction(this, "CreateLinkLambda", {
            entry: path.join(__dirname, "../app/cmd/createLink"),
            architecture: cdk.aws_lambda.Architecture.ARM_64,
            bundling: {
                assetHash: Math.random().toString(36).substring(7),
                assetHashType: cdk.AssetHashType.CUSTOM,
            },
        });

        // Visit Link Lambda Function
        const visitLinkLambda = new GoFunction(this, "VisitLinkLambda", {
            entry: path.join(__dirname, "../app/cmd/visitLink"),
            architecture: cdk.aws_lambda.Architecture.ARM_64,
            bundling: {
                assetHash: Math.random().toString(36).substring(7),
                assetHashType: cdk.AssetHashType.CUSTOM,
            },
        });

        // Create a Request Validator
        const requestValidator = new cdk.aws_apigateway.RequestValidator(
            this,
            "HermesRequestValidator",
            {
                restApi: apiGateway,
                validateRequestBody: true,
                validateRequestParameters: true,
            },
        );

        // Create a new API Gateway resource and hook it up to our Lambda
        const createLinkLambdaIntegration =
            new cdk.aws_apigateway.LambdaIntegration(createLinkLambda);

        const visitLinkLambdaIntegration =
            new cdk.aws_apigateway.LambdaIntegration(visitLinkLambda);

        const postMethod = apiGateway.root.addMethod(
            "POST",
            createLinkLambdaIntegration,
            {
                requestValidator,
            },
        );

        // Catch-all method for GET requests
        const getMethod = apiGateway.root
            .addResource("{proxy+}")
            .addMethod("GET", visitLinkLambdaIntegration, {
                requestValidator,
            });

        new cdk.CfnOutput(this, "API URL", {
            value: apiGateway.url,
        });

        NagSuppressions.addStackSuppressions(this, [
            {
                id: "AwsSolutions-IAM4",
                reason: "No IAM Roles are used in this stack",
            },
        ]);

        // Supressing
        NagSuppressions.addResourceSuppressions(
            [getMethod, postMethod],
            [
                {
                    id: "AwsSolutions-APIG4",
                    reason: "This is a public API",
                },
                {
                    id: "AwsSolutions-COG4",
                    reason: "This is a public API",
                },
            ],
        );

        cdk.Tags.of(this).add("Project", props?.stackName ?? "Hermes-Unknown");
    }
}
