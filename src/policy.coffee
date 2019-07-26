Policy = (SDK, global, meta, local) ->
  {name} = local.bucket
  resources = [
    "arn:aws:s3:::#{name}"
    "arn:aws:s3:::#{name}/*"
    "arn:aws:s3:::#{name}-pre"
    "arn:aws:s3:::#{name}-pre/*"
  ]

  [
    Effect: "Allow"
    Action: [ "s3:*" ]
    Resource: resources
  ]

export default Policy
