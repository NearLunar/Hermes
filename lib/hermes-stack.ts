import { GoFunction } from "@aws-cdk/aws-lambda-go-alpha";
import * as cdk from "aws-cdk-lib";
import { type Construct } from "constructs";
import path from "path";

export class HermesStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // The code that defines your stack goes here
        const createLinkLambda = new GoFunction(this, "CreateLinkLambda", {
            entry: path.join(__dirname, "../app/cmd/createLink"),
        });

        new cdk.CfnOutput(this, "FunctionName", {
            value: createLinkLambda.functionName,
        });
    }
}
