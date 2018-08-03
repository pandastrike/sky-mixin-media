# Panda Sky Mixin: Media
# This mixin allocates a variety of AWS resources to setup a media server for your app.  That includes an S3 bucket that can accept multipart uploads (via signed URLs) and public reads.  There is also an edge-cached CDN to get that all to the edge.

import {cat, isObject, plainText, camelCase, capitalize} from "fairmont"

import {bucketURL, root} from "./url"
import ACM from "./acm"
import S3 from "./bucket-scan"

process = (_AWS_, config) ->
  {fetch: fetchCertificate} = ACM _AWS_
  {exists} = S3 _AWS_

  # Start by extracting out the Media Mixin configuration:
  {env, tags=[]} = config
  c = config.aws.environments[env].mixins.media
  c = if isObject c then c else {}
  c.tags = cat (c.tags || []), tags

  {buckets=[], tags} = c

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
      certificate: await fetchCertificate hostname
      hostedzone: root hostname
      tags
    }


  # Output configuration to be used by the Media template.
  {
    buckets: needed
    edges
  }


export default process
