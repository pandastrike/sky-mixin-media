import {join} from "path"
import {rm, write} from "panda-quill"
import {include} from "panda-parchment"
import Kraken from "kraken"

import SDK from "aws-sdk"
import Sundog from "sundog"
{S3, ASM} = Sundog(SDK).AWS
{get} = S3()
{read} = ASM()

kraken = do ->
  {key, secret} = (await read process.env.kraken)
  new Kraken
    api_key: key
    api_secret: secret

baseParameters = (path) ->
  file: path
  wait: false
  callback_url: process.env.callbackURL
  json: true
  lossy: true
  preserve_meta: ["copyright"]
  sampling_scheme: "4:4:4"
  resize:
    width: 1080,
    height: 1080,
    strategy: "auto"

jpegParameters = (base) ->
  include base,
    convert:
      format: "jpeg"
      background: "#ffffff"

pngParameters = (base) ->
  include base,
    convert:
      format: "png"

gifParameters = (base) ->
  include base,
    convert:
      format: "gif"


parameters = (type, path) ->
  p = baseParameters path
  switch type
    when "image/jpeg", "image/jpg", "image/png"
      jpegParameters p
    when "image/png"
      pngParameters p
    when "image/gif"
      gifParameters p
    else
      throw new Error "unknown type #{type}"

upload = (options) ->
  _kraken = await kraken
  new Promise (resolve, reject) ->
    _kraken.upload options, (fail, response) ->
      reject fail if fail
      resolve response

processImage = ({bucket, key, metadata}) ->
  ## For Images
  # =====================================================
  # Grab the image from S3 and write to temporary disk.
  type = metadata["Content-Type"]
  file = await get bucket, key, "binary"
  path = join "/tmp", key
  await write path, file

  # Eneque with Kraken.
  response = await upload parameters type, path
  console.log {key, response}
  await rm path

export default processImage
