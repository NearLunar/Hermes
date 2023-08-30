#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { HermesStack } from "../lib/hermes-stack";

const app = new cdk.App();
new HermesStack(app, "Prod", {
  stackName: "HermesProd",
  description: "Hermes (URL Shortener) Production Stack",
});
new HermesStack(app, "Dev", {
  stackName: "HeremesDev",
  description: "Hermes (URL Shortener) Development Stack",
});
