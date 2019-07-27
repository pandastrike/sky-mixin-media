import {include, toJSON, merge, last} from "panda-parchment"
import Sundog from "sundog"
import {Helpers} from "sundog"

preprocess = (SDK, global, meta, local) ->
  {AWS} = Sundog SDK

  fetch = (name) ->
    if cert = await AWS.ACM(region: "us-east-1").fetch name
      cert
    else
      throw new Error "Unable to locate wildcard cert for #{name}"

  exists = (name) -> await AWS.S3().bucketExists name

  readASM = (name) -> (await AWS.ASM().get name).ARN

  {bucket, tags={}} = local

  # Expand the configuration for whole CDN stack.
  include bucket,
    preprocessing: bucket.name + "-pre"
    hostname: bucket.hostname + "." + global.domain
    bucketURL: bucket.name + ".s3.amazonaws.com"
    expires: bucket.expires ? 60
    certificate: await fetch global.domain
    priceClass: "PriceClass_" + (bucket.priceClass || 100)
    hostedzone: Helpers.url.root global.domain
    waf:
      floodThreshold: bucket.waf?.floorThreshold ? 2000
      errorThreshold: bucket.waf?.errorThreshold ? 50
      blockTTL: bucket.waf?.blockTTL ? 240
      logBucket: bucket.name + "-cflogs"
    optimization:
      functionName: "#{global.environment.stack.name}-media-upload"
      code: "mixins/#{meta.name}/upload-hook.zip"
      image: merge bucket.optimization.image,
        ARN: await readASM bucket.optimization.image.key

    tags: tags

  include bucket,
    needsPreprocessingBucket: !(await exists bucket.preprocessing)
    needsFinalBucket: !(await exists bucket.name)
    needsLogBucket: !(await exists bucket.waf.logBucket)

  # Output configuration to be used by the Media template.
  bucket: bucket
  global:
    name: global.environment.stack.name
    bucket: global.environment.stack.bucket


export default preprocess
