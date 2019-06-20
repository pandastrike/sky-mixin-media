import "source-map-support/register"
import kraken from "./kraken"
import SDK from "aws-sdk"
import Sundog from "sundog"

{AWS:{S3}} = Sundog SDK
{head} = S3()

handler = ({Records}, context, callback) ->
  try
    bucket = Records[0].s3.bucket.name
    key = Records[0].s3.object.key
    metadata = (await head bucket, key).Metadata
    console.log {key, metadata}
    type = metadata["Content-Type"]

    switch type
      # Images are optimized via Kraken.io
      when "image/jpeg", "image/jpg", "image/png", "image/gif"
        await kraken {bucket, key, metadata}
      else
        throw new Error "unknown content-type #{type}"

    callback null, "success"
  catch e
    console.log e
    callback new Error "upload hook failure"

export {handler}
