import krakenImage from "./kraken-image"

import Sundog from "sundog"
s3 = Sundog().S3()

pullFile = (Records) ->
  bucket = Records[0].s3.bucket.name
  key = Records[0].s3.object.key
  metadata = await s3.head bucket, key
  console.log metadata

  {bucket, key, metadata, s3}

dispatch = (context) ->
  type = context.metadata.ContentType

  switch type
    when "image/jpeg", "image/jpg", "image/png", "image/webp"
      await krakenImage context
    else
      throw new Error "unknown content-type #{type}"

export {pullFile, dispatch}
