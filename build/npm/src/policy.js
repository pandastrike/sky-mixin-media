"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fairmont = require("fairmont");

// Panda Sky Mixin: Media Policy
// This mixin grants the API Lambdas access to the specified S3 buckets.  That IAM Role permission is rolled into your CloudFormation stack after being generated here.
var Policy;

Policy = function (config, global) {
  var i, len, n, names, resources;
  // Grant total access to the buckets listed in this mixin.
  // TODO: Consider limiting the actions on those buckets and/or how to specify limitations within the mixin configuration.
  names = (0, _fairmont.collect)((0, _fairmont.project)("name", config.buckets));
  resources = [];
  for (i = 0, len = names.length; i < len; i++) {
    n = names[i];
    resources.push(`arn:aws:s3:::${n}`);
    resources.push(`arn:aws:s3:::${n}/*`);
  }
  return [{
    Effect: "Allow",
    Action: ["s3:*"],
    Resource: resources
  }];
};

exports.default = Policy;