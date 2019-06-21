# Panda Sky Mixin: Media
# This mixin allocates a variety of AWS resources to setup a media server for your app.  That includes an S3 bucket that can accept multipart uploads (via signed URLs) and public reads.  There is also an edge-cached CDN to get that all to the edge.

import {cat, isObject, plainText, camelCase, capitalize, include} from "panda-parchment"
import Sundog from "sundog"
import addResources from "./bucket-resources"

_fetch = (AWS) ->
  {fetch} = AWS.ACM region: "us-east-1" # we always store certs here
  (name) ->
    if cert = await fetch name
      cert
    else
      throw new Error "Unable to locate wildcard cert for #{name}"

_exists = (AWS) ->
  {bucketExists} = AWS.S3()
  await bucketExists name

wafDefaults = (out={}) ->
  out.floodThreshold ?= 2000
  out.errorThreshold ?= 50
  out.blockTTL ?= 240
  out


process = (SDK, config) ->
  {AWS} = Sundog SDK
  {root} = AWS.URL
  await addResources AWS, config
  fetchCert = _fetch AWS
  exists = _exists AWS

  # Start by extracting out the Media Mixin configuration:
  {env, tags=[]} = config
  c = config.aws.environments[env].mixins.media
  c = if isObject c then c else {}
  tags = cat (c.tags || []), tags
  bucket = c.bucket ? {}

  # Expand the configuration for whole CDN stack.
  hostname = bucket.hostname + "." + config.aws.domain
  inlclude bucket,
    preprocessing: bucket.name + "-pre"
    hostname: hostname
    bucketURL: "#{bucket.name}.s3.amazonaws.com"
    expires: bucket.expires ? 60
    certificate: await fetchCert hostname
    priceClass: "PriceClass_" + (bucket.priceClass || 100)
    hostedzone: root hostname
    logBucket: "#{bucket.name}-cflogs"
    waf: wafDefaults bucket.waf
    optimization: bucket.optimization
    tags: tags

  include bucket,
    needsPreprocessingBucket: await exists bucket.preprocessing
    needsFinalBucket: await exists bucket.name

  # Output configuration to be used by the Media template.
  bucket: bucket
  name: "#{config.environmentVariables.fullName}-media"
  skyBucket: config.environmentVariables.skyBucket


export default process
