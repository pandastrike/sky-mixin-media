import os from "os"
import {promises as fs} from "fs"
import Path from "path"
import {flow} from "panda-garden"
import {glob, read, write, rmr} from "panda-quill"
import {toJSON} from "panda-parchment"
import Sundog from "sundog"
import webpack from "webpack"
import JSZip from "jszip"

import {shell} from "./utils"

getPath = (parts...) ->
  Path.resolve __dirname, "..", "..", "..", "files", "resources", parts...

setupContext = (SDK, global, meta, local, processed) ->
  (main) ->
    mixin = {SDK, global, meta, local, processed}
    {main, mixin}

confirmOriginAccess = (context) ->
  s3 = context.main.sundog.S3()
  {get, create} = context.main.sundog.CloudFront().originAccess

  name = context.mixin.processed.global.originAccessName
  unless (OAID = await get name)
    return context

  name = context.mixin.processed.bucket.name
  await s3.bucketSetPolicy name, toJSON
    Version: "2008-10-17"
    Statement: [
      Effect: "Allow"
      Principal:
        CanonicalUser: OAID.S3CanonicalUserId
      Action: "s3:GetObject"
      Resource: "arn:aws:s3:::#{name}/*"
    ]

  context

setupTempDirectory = (context) ->
  tmpDir = os.tmpdir()
  context.mixin.temp = await fs.mkdtemp "#{tmpDir}#{Path.sep}"
  context

writeEnvironmentVariables = (context) ->
  root = context.mixin.temp
  string = toJSON context.mixin.processed.env
  await write (Path.resolve root, "env.json"), string
  context

bundle = (context) ->
  console.log "bundling S3 upload hook..."

  new Promise (yay, nay) ->
      webpack
        entry: getPath "upload-hook", "index.coffee"
        mode: "production"
        devtool: "inline-source-map"
        target: "node"
        output:
          path: Path.resolve context.mixin.temp, "lib"
          filename: "index.js"
          libraryTarget: "umd"
          devtoolNamespace: "upload-hook"
          devtoolModuleFilenameTemplate: (info, args...) ->
            {namespace, resourcePath} = info
            "webpack://#{namespace}/#{resourcePath}"

        externals:
          "aws-sdk": "aws-sdk"
          sharp: "sharp"
          pngquant: "pngquant"

        module:
          rules: [
            test: /\.coffee$/
            use: [
              loader: "coffee-loader"
              options:
                transpile:
                  presets: [[
                    "@babel/preset-env",
                    targets:
                      node: "10.16"
                  ]]
            ]
          ,
            test: /\.js$/
            use: [ "source-map-loader" ]
            enforce: "pre"
          ,
            test: /\.yaml$/
            use: [ "yaml-loader" ]
          ,
            test: /^\.\/src.*\.json$/
            use: [ "json-loader" ]
          ]
        resolve:
          alias:
            "-sky-mixin-env": Path.resolve context.mixin.temp, "env.json"
          modules: [
            "node_modules"
          ]
          extensions: [ ".js", ".json", ".coffee" ]
        plugins: [

        ]
        (err, stats) ->
          if err?
            console.error err.stack || err
            console.error err.details if err.details
            nay new Error "Error during webpack build."

          info = stats.toString colors: true

          if stats.hasErrors()
            console.error info.errors
            nay new Error "Error during webpack build."

          if stats.hasWarnings()
            console.warn info.warnings

          console.log info
          yay context

writeSharpLib = (context) ->
  cwd = Path.resolve context.mixin.temp, "lib"
  version = "8.8.1"

  await shell "npm init -y", cwd
  await shell "npm i --arch=x64 --platform=linux --target=10.16.0 sharp", cwd

  await shell "curl -L https://github.com/avishnyak/sharp-libvips/releases/download/v#{version}/libvips-#{version}-linux-x64.tar.gz -o libvips-#{version}-linux-x64.tar.gz", cwd

  await shell "tar -zxf libvips-#{version}-linux-x64.tar.gz -C node_modules/sharp/vendor", cwd

  await shell "rm -rf libvips-#{version}-linux-x64.tar.gz", cwd

  context

zip = (context) ->
  cwd = context.mixin.temp
  files = await glob "lib/**", cwd
  files.sort()

  Zip = new JSZip()

  for path in files
    name = Path.relative cwd, path
    data = await read path, "buffer"
    Zip.file name, data,
      date: new Date "2019-08-12T19:17:56.050Z" # Lie to get consistent hash
      createFolders: false

  archive = await Zip.generateAsync
    type: "nodebuffer"
    compression: "DEFLATE"
    compressionOptions: level: 9

  context.mixin.bundlePath = Path.resolve cwd, "upload-hook.zip"
  await write context.mixin.bundlePath, archive

  context


updateLambda = (context) ->
  {SDK} = context.mixin
  {global, processed, bundlePath} = context.mixin

  {S3, Lambda} = Sundog SDK.config
  s3 = S3()
  lambda = Lambda()

  {bucket} = global.environment.stack
  key = processed.bucket.optimization.code
  name = processed.bucket.optimization.functionName

  # Push S3 bucket hook lambda code to orchestration bucket
  console.log "Syncing media upload hook @"
  console.log "   #{bucket}"
  console.log "   #{key}"
  await s3.PUT.file bucket, key, bundlePath

  if await lambda.get name
    console.log "updating upload hook: #{name}"
    await lambda.update name, bucket, key
    console.log "update complete."

  context

cleanup = (context) ->
  try
    await shell "rm -rf #{context.mixin.temp}"
  catch e
    console.warn "Unable to delete #{context.mixin.temp} As a temporary directory, this will be cleaned up by your OS eventually. #{e}"
  context


beforeHook = (SDK, global, meta, local, processed) ->

  flow [
    setupContext SDK, global, meta, local, processed
    confirmOriginAccess
    setupTempDirectory
    writeEnvironmentVariables
    bundle
    writeSharpLib
    zip
    updateLambda
    cleanup
  ]

export default beforeHook
