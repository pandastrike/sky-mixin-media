import {include, toJSON, merge, last} from "panda-parchment"
import Sundog from "sundog"
import {Helpers} from "sundog"

preprocess = (SDK, global, meta, local) ->
  {ACM, ASM, S3} = Sundog SDK.config
  acm = ACM region: "us-east-1"
  asm = ASM()
  s3 = S3()

  fetch = (name) ->
    if cert = await acm.fetch name
      cert
    else
      throw new Error "Unable to locate wildcard cert for #{name}"

  exists = (name) -> await s3.bucketExists name

  readASM = (name) -> (await asm.get name).ARN

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

    tags: tags

  include bucket,
    needsPreprocessingBucket: !(await exists bucket.preprocessing)
    needsFinalBucket: !(await exists bucket.name)
    needsLogBucket: !(await exists bucket.waf.logBucket)

  # Output configuration to be used by the Media template.
  bucket: bucket
  global:
    name: global.environment.stack.name
    originAccessName: global.environment.stack.name + "-media"
    bucket: global.environment.stack.bucket
  env:
    targetBucket: bucket.name



export default preprocess
