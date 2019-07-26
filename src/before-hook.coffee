import {resolve} from "path"
import Sundog from "sundog"

getPath = (name) ->
  resolve __dirname, "..", "..", "..", "files", "resources", name

apply = (SDK, global, meta, local, processed) ->
  (context) ->
    s3 = context.sundog.S3()
    lambda = context.sundog.Lambda()

    {bucket} = global.environment.stack
    key = processed.bucket.optimization.code
    name = processed.bucket.optimization.functionName

    # Push S3 bucket hook lambda code to orchestration bucket
    console.log "Syncing media upload hook @"
    console.log "   #{bucket}"
    console.log "   #{key}"
    await s3.PUT.file bucket, key, getPath "upload-hook.zip"

    try
      await lambda.get name
      console.log "updating upload hook: #{name}"
      await lambda.update name, bucket, key
    catch

export default apply
