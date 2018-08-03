# Panda Sky Mixin: Media Policy
# This mixin grants the API Lambdas access to the specified S3 buckets.  That IAM Role permission is rolled into your CloudFormation stack after being generated here.

import {collect, project} from "fairmont"

Policy = (config, global) ->
  # Grant total access to the buckets listed in this mixin.
  # TODO: Consider limiting the actions on those buckets and/or how to specify limitations within the mixin configuration.

  names = collect project "name", config.buckets
  resources = []
  for n in names
    resources.push "arn:aws:s3:::#{n}"
    resources.push "arn:aws:s3:::#{n}/*"

  [
    Effect: "Allow"
    Action: [ "s3:*" ]
    Resource: resources
  ]

export default Policy
