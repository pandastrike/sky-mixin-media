import {join} from "path"
import {PassThrough} from "stream"
import {flow} from "panda-garden"
import {include, toJSON} from "panda-parchment"
import {write, rmr} from "panda-quill"
import mime from "mime"
import Kraken from "kraken"
import Sharp from "sharp"
import ENV from "-sky-mixin-env"

kraken = new Kraken
  api_key: ENV.key
  api_secret: ENV.secret

upload = (options) ->
  new Promise (resolve, reject) ->
    kraken.upload options, (fail, response) ->
      reject fail if fail
      resolve response


# Grab the image from S3 and store as a buffer.
pullFile = (context) ->
  {bucket, key} = context
  context.file = await context.s3.get bucket, key, "binary"
  context

# Until Kraken supports WebP input files, convert them to PNG.
handleWEBPInput = (context) ->
  if context.metadata.ContentType != "image/webp"
    return context
  else
    context.file = await Sharp(context.file).png().toBuffer()
    context

writeToTemp = (context) ->
  path = join "/tmp", context.key
  await write path, context.file
  context.file = path
  context


addTask = (targetFormat) ->
  (context) ->
    # TODO: Why can't I get this working by giving the client a stream?
    options =
      file: context.file
      wait: false
      callback_url: ENV.callbackURL
      json: true
      lossy: true
      preserve_meta: ["copyright"]
      sampling_scheme: "4:4:4"
      resize: do ->
        for size in [50, 400, 1280, 1920]
          id: size, width: size, height: size, strategy: "auto"

    switch targetFormat
      when "webp"
        options.webp = true
      when "jpeg"
        options.convert =
          format: "jpeg"
          background: "#ffffff"
      when "png"
        unless context.metadata.Metadata.transparency == "true"
          return context
        options.convert = format: "png"

    console.log toJSON options, true

    console.log await upload options
    context

clean = (context) ->
  await rmr context.file
  context


processImage = flow [
  pullFile
  handleWEBPInput
  writeToTemp
  addTask "webp"
  addTask "jpeg"
  addTask "png"
  clean
]

export default processImage
