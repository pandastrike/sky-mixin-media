# Panda Sky Mixin: Media
# This mixin allocates a variety of AWS resources to setup a media server for your app.  That includes an S3 bucket that can accept multipart uploads (via signed URLs) and public reads.  There is also an edge-cached CDN to get that all to the edge.

import {cat, isObject, plainText, camelCase, capitalize, merge} from "panda-parchment"
import Sundog from "sundog"
import S3 from "./bucket-scan"
import addResources from "./bucket-resources"

process = (SDK, config) ->
  {AWS: {ACM, URL:{root}}} = Sundog SDK
  {fetch} = ACM region: "us-east-1" # we always store certs here
  {exists} = await S3 SDK, config
  await addResources SDK, config

  _fetch = (name) ->
    if cert = await fetch name
      cert
    else
      throw new Error "Unable to locate wildcard cert for #{name}"

  wafDefaults = (out={}) ->
    out.floodThreshold ?= 2000
    out.errorThreshold ?= 50
    out.blockTTL ?= 240
    out

  # Start by extracting out the Media Mixin configuration:
  {env, tags=[]} = config
  c = config.aws.environments[env].mixins.media
  c = if isObject c then c else {}
  tags = cat (c.tags || []), tags
  bucket = c.bucket ? {}

  # Expand the configuration for whole CDN stack.
  hostname = bucket.hostname + "." + config.aws.domain
  bucket = merge bucket, {
    new: !(await exists bucket.name)
    preprocessing: bucket.name + "-pre"
    hostname,
    bucketURL: "#{bucket.name}.s3.amazonaws.com"
    expires: bucket.expires ? 60
    certificate: await _fetch hostname
    priceClass: "PriceClass_" + (bucket.priceClass || 100)
    hostedzone: root hostname
    logBucket: "#{bucket.name}-cflogs"
    waf: wafDefaults bucket.waf
    optimization: bucket.optimization
    tags
  }

  # Output configuration to be used by the Media template.
  {
    bucket
    name: "#{config.environmentVariables.fullName}-media"
    skyBucket: config.environmentVariables.skyBucket
  }


export default process
