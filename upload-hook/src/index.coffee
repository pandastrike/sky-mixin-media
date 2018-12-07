import Kraken from "kraken"

kraken = new Kraken
    api_key: process.env.krakenKey
    api_secret: process.env.krakenSecret

parameters = (bucket, key) ->
  url: "https://s3.amazonaws.com/#{bucket}/#{key}"
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
    kraken.url options, (fail, response) ->
      reject fail if fail
      resolve response

handler = ({Records}, context, callback) ->
  try
    bucket  = Records[0].s3.bucket.name
    key     = Records[0].s3.object.key

    # TODO: typecheck for images / videos

    # Eneque with Kraken. # TODO: Can this be a direct upload?
    response = await upload parameters bucket, key
    console.log {response}
    callback null, response
  catch e
    console.log e
    callback null, "failure"

export {handler}
