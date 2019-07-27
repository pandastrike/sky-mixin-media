import {include, toJSON, merge, last} from "panda-parchment"
import Sundog from "sundog"
import {Helpers} from "sundog"

# # TODO: Fix this in Sundog
#
#
# # Enforces "fully qualified" form of hostnames and domains.  Idompotent.
# fullyQualify = (name) -> if last(name) == "." then name else name + "."
#
# # Named somewhat sarcastically.  Enforces "regular" form of hostnames
# # and domains that is more expected when navigating.  Idompotnent.
# regularlyQualify = (name) -> if last(name) == "." then name[...-1] else name
#
# # Given an arbitrary URL, return the fully qualified root domain.
# # https://awesome.example.com/test/42#?=What+is+the+answer  =>  example.com.
# root = (url) ->
#   try
#     # Remove protocol (http, ftp, etc.), if present, and get domain
#     domain = url.split('/')
#     domain = if "://" in url then domain[2] else domain[0]
#
#     # Remove port number, if present
#     domain = domain.split(':')[0]
#
#     # Now grab the root: the top-level-domain, plus the term to the left.
#     terms = regularlyQualify(domain).split(".")
#     terms = terms.slice(terms.length - 2)
#
#     # Return the fully qualified version of the root
#     fullyQualify terms.join(".")
#   catch e
#     throw new Error "Failed to parse root url: #{e}"


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
