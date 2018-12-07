import {resolve, relative} from "path"
import Sundog from "sundog"
import {ls, lsR, read} from "panda-quill"
import warningMsg from "./warning-messages"

resourcePath = resolve __dirname, "..", "..", "..", "..", "files", "resources"
key = (path) -> relative resourcePath, path

apply = (SDK, config) ->
  {AWS: {S3}} = Sundog SDK
  s3 = S3()
  {skyBucket} = config.environmentVariables

  # Push mixin-specific resources to the orchestration bucket.  This includes:  # - an altered version of the WAF template to deal with our too-long names
  # - the lambda code needed to support media optimization.
  await s3.bucketTouch config.environmentVariables.skyBucket

  for resource in (await lsR resourcePath)
    await s3.put skyBucket, "mixin-code/media/#{key resource}", resource, false


export default apply
