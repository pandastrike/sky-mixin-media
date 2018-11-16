# Panda Sky Mixin: Media
# This mixin allocates a variety of AWS resources to setup a media server for your app.  That includes an S3 bucket that can accept multipart uploads (via signed URLs) and public reads.  There is also an edge-cached CDN to get that all to the edge.

import {cat, isObject, plainText, camelCase, capitalize, merge} from "panda-parchment"
import Sundog from "sundog"
import S3 from "./bucket-scan"

process = (SDK, config) ->
  {AWS: {ACM, URL:{root}}} = Sundog SDK
  {fetch} = ACM region: "us-east-1" # we always store certs here
  {exists} = await S3 SDK, config

  _fetch = (name) ->
    if cert = await fetch hostname
      cert
    else
      throw new Error "Unable to locate wildcard cert for #{name}"

  wafDefaults = (global, local) ->
    out = merge global, (local ? {})
    out.floodThreshold ?= 2000
    out.errorThreshold ?= 50
    out.blockTTL ?= 240
    out

  # Start by extracting out the Media Mixin configuration:
  {env, tags=[]} = config
  c = config.aws.environments[env].mixins.media
  c = if isObject c then c else {}
  c.tags = cat (c.tags || []), tags

  {buckets=[], tags, waf={}} = c

  # Only specify an S3 bucket if it does not already exist.
  needed = []
  for b in buckets when !(await exists b.name)
    needed.push {
      resourceTitle: capitalize camelCase plainText b.name
      name: b.name
      expires: b.expires
      tags
    }

  # For every possible bucket, specify the CloudFormation + Route53 stack that forms its CDN edge.
  edges = []
  for b in buckets
    hostname = b.hostname + "." + config.aws.domain
    edges.push {
      resourceTitle: capitalize camelCase plainText b.name
      hostname
      expires: b.expires
      priceClass: "PriceClass_" + (b.priceClass || 100)
      bucketDomainName: "#{b.name}.s3.amazonaws.com"
      certificate: await _fetch hostname
      hostedzone: root hostname
      logBucket: "#{b.name}-cflogs"
      waf: wafDefaults waf, b.waf
      tags
    }


  # Output configuration to be used by the Media template.
  {
    buckets: needed
    edges
    rootName: "#{config.environmentVariables.fullName}-media"
    skyBucket: config.environmentVariables.skyBucket
  }


export default process
