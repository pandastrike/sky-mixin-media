import SDK from "aws-sdk"
import {join} from "path"
import Kraken from "kraken"
import {rm, write} from "panda-quill"
import Sundog from "sundog"

{AWS:{S3}} = Sundog SDK
{get, head} = S3()

kraken = new Kraken
    api_key: process.env.krakenKey
    api_secret: process.env.krakenSecret

parameters = (file) ->
  file: file
  wait: false
  callback_url: process.env.callbackURL
  json: true
  lossy: true
  preserve_meta: ["copyright"]
  sampling_scheme: "4:4:4"
  convert:
    format: "jpeg"
  resize:
    width: 1080,
    height: 1080,
    strategy: "auto"

upload = (options) ->
  new Promise (resolve, reject) ->
    kraken.upload options, (fail, response) ->
      reject fail if fail
      resolve response

handler = ({Records}, context, callback) ->
  try
    bucket  = Records[0].s3.bucket.name
    key     = Records[0].s3.object.key
    metadata    = (await head bucket, key).Metadata
    console.log {key, metadata}

    # TODO: Have a decision tree based on the incoming type.

    ## For Images
    # =====================================================
    # Grab the image from S3 and write to temporary disk.
    file = await get bucket, key, "binary"
    path = join "/tmp", key
    await write path, file

    # Eneque with Kraken.
    response = await upload parameters path
    console.log {key, response}
    await rm path
    callback null, "success"
  catch e
    console.log e
    callback null, "failure"

export {handler}
