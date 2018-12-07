# Panda Sky Mixin: Media Policy
# This mixin grants the API Lambdas access to the specified S3 buckets.  That IAM Role permission is rolled into your CloudFormation stack after being generated here.

import {collect, project} from "panda-river"

Policy = (config, global) ->
  # Grant total access to the buckets listed in this mixin.
  # TODO: Consider limiting the actions on those buckets and/or how to specify limitations within the mixin configuration.

  {name} = config.bucket
  resources = [
    "arn:aws:s3:::#{name}-pre"
    "arn:aws:s3:::#{name}-pre/*"
  ]

  [
    Effect: "Allow"
    Action: [ "s3:*" ]
    Resource: resources
  ]

export default Policy
