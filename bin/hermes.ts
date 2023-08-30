#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { Aspects } from "aws-cdk-lib";
import { AwsSolutionsChecks } from "cdk-nag";
import "source-map-support/register";
import { HermesStack } from "../lib/hermes-stack";

const app = new cdk.App();

new HermesStack(app, "Prod", {
    stackName: "HermesProd",
    description: "Hermes (URL Shortener) Production Stack",
});
new HermesStack(app, "Dev", {
    stackName: "HermesDev",
    description: "Hermes (URL Shortener) Development Stack",
});

Aspects.of(app).add(new AwsSolutionsChecks({}));
