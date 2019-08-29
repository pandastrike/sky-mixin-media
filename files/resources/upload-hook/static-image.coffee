import {join} from "path"
import {PassThrough} from "stream"
import {flow} from "panda-garden"
import {include, toJSON} from "panda-parchment"
import {write, rmr} from "panda-quill"
import mime from "mime"
import Sharp from "sharp"
import ENV from "-sky-mixin-env"

# TODO: Decide how we want to handle sharpen.
#.sharpen 1.15, 0.1, 0.3

_upload = (s3, name, ext, ContentType) ->
  (size, buffer) ->
    await s3.PUT.buffer ENV.targetBucket,
      (join "images", "#{size}", "#{name}.#{ext}"),
      buffer,
      {ContentType}


# Grab the image from S3 and store as a buffer.
pullFile = (context) ->
  {bucket, key} = context
  context.file = await context.s3.get bucket, key, "binary"
  context

generateWebP = (context) ->
  {s3, file, key} = context
  upload = _upload s3, key, "webp", "image/webp"

  await upload 50,
    await Sharp file
    .resize
      width: 50
      height: 50
      fit: "inside"
      kernel: "lanczos3"
      withoutEnlargement: true
    .webp
      quality: 80
      alphaQuality: 100
      smartSubsample: true
      reductionEffort: 6
      force: true
    .toBuffer()

  await upload 400,
    await Sharp file
    .resize
      width: 400
      height: 400
      fit: "inside"
      kernel: "lanczos3"
      withoutEnlargement: true
    .webp
      quality: 60
      alphaQuality: 60
      smartSubsample: true
      reductionEffort: 6
      force: true
    .toBuffer()


  await upload 1280,
    await Sharp file
    .resize
      width: 1280
      height: 1280
      fit: "inside"
      kernel: "lanczos3"
      withoutEnlargement: true
    .webp
      quality: 80
      alphaQuality: 80
      smartSubsample: true
      reductionEffort: 6
      force: true
    .toBuffer()

  await upload 1920,
    await Sharp file
    .resize
      width: 1920
      height: 1920
      fit: "inside"
      kernel: "lanczos3"
      withoutEnlargement: true
    .webp
      quality: 80
      alphaQuality: 80
      smartSubsample: true
      reductionEffort: 6
      force: true
    .toBuffer()

  context

generateJPEG = (context) ->
  {s3, file, key} = context
  upload = _upload s3, key, "jpeg", "image/jpeg"

  await upload 50,
    await Sharp file
    .resize
      width: 50
      height: 50
      fit: "inside"
      withoutEnlargement: true
      kernel: "lanczos3"
      background: r:255, g:255, b:255, alpha:1
    .jpeg
      quality: 80
      progressive: false
      chromaSubsampling: "4:4:4"
      trellisQuantisation: true
      overshootDeringing: true
      optimizeScans: false
      optimizeCoding: true
      quantizationTable: 2
      force: true
    .toBuffer()

  await upload 400,
    await Sharp file
    .resize
      width: 400
      height: 400
      fit: "inside"
      withoutEnlargement: true
      kernel: "lanczos3"
      background: r:255, g:255, b:255, alpha:1
    .jpeg
      quality: 60
      progressive: false
      chromaSubsampling: "4:4:4"
      trellisQuantisation: true
      overshootDeringing: true
      optimizeScans: false
      optimizeCoding: true
      quantizationTable: 2
      force: true
    .toBuffer()

  await upload 1280,
    await Sharp file
    .resize
      width: 1280
      height: 1280
      fit: "inside"
      withoutEnlargement: true
      kernel: "lanczos3"
      background: r:255, g:255, b:255, alpha:1
    .jpeg
      quality: 80
      progressive: false
      chromaSubsampling: "4:4:4"
      trellisQuantisation: true
      overshootDeringing: true
      optimizeScans: false
      optimizeCoding: true
      quantizationTable: 4
      force: true
    .toBuffer()

  await upload 1920,
    await Sharp file
    .resize
      width: 1920
      height: 1920
      fit: "inside"
      withoutEnlargement: true
      kernel: "lanczos3"
      background: r:255, g:255, b:255, alpha:1
    .jpeg
      quality: 80
      progressive: false
      chromaSubsampling: "4:4:4"
      trellisQuantisation: true
      overshootDeringing: true
      optimizeScans: false
      optimizeCoding: true
      quantizationTable: 4
      force: true
    .toBuffer()

  context

generatePNG = (context) ->
  {s3, file, key, metadata} = context
  return context unless metadata.Metadata.transparency == "true"
  upload = _upload s3, key, "png", "image/png"

  await upload 50,
    await Sharp file
    .resize
      width: 50
      height: 50
      fit: "inside"
      kernel: "lanczos3"
      withoutEnlargement: true
    .png
      progressive: false
      compressionLevel: 9
      adaptiveFiltering: true
      palette: true
      quality: 80
      dither: 1.0
      force: true
    .toBuffer()

  await upload 400,
    await Sharp file
    .resize
      width: 400
      height: 400
      fit: "inside"
      kernel: "lanczos3"
      withoutEnlargement: true
    .png
      progressive: false
      compressionLevel: 9
      adaptiveFiltering: true
      palette: true
      quality: 60
      dither: 1.0
      force: true
    .toBuffer()

  await upload 1280,
    await Sharp file
    .resize
      width: 1280
      height: 1280
      fit: "inside"
      kernel: "lanczos3"
      withoutEnlargement: true
    .png
      progressive: false
      compressionLevel: 9
      adaptiveFiltering: true
      palette: true
      quality: 80
      dither: 1.0
      force: true
    .toBuffer()

  await upload 1920,
    await Sharp file
    .resize
      width: 1920
      height: 1920
      fit: "inside"
      kernel: "lanczos3"
      withoutEnlargement: true
    .png
      progressive: false
      compressionLevel: 9
      adaptiveFiltering: true
      palette: true
      quality: 80
      dither: 1.0
      force: true
    .toBuffer()

  context


processImage = flow [
  pullFile
  generateWebP
  generateJPEG
  generatePNG
]

export default processImage
