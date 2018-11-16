import {resolve} from "path"
import Sundog from "sundog"
import warningMsg from "./warning-messages"


_S3 = (SDK, config) ->
  {AWS: {S3}} = Sundog SDK
  s3 = S3()

  # Push our altered version of the WAF template to the orchestration bucket.  We need this becuase nested stack names are too long to be used as WAF Rule names, as the version published by AWS tries to do.  Work on not needing to do this.
  await s3.bucketTouch config.environmentVariables.skyBucket
  await s3.put config.environmentVariables.skyBucket, "mixin-code/media/waf.json", (resolve __dirname, "..", "..", "..", "..", "files", "waf.json"), false

  exists = (name) ->
    try
      await s3.bucketExists name
    catch e
      warningMsg e
      throw e

  {exists}

export default _S3
