import {resolve} from "path"
import Sundog from "sundog"
import warningMsg from "./warning-messages"


helpers = (SDK, config) ->
  {AWS: {S3}} = Sundog SDK
  s3 = S3()

  exists = (name) ->
    try
      await s3.bucketExists name
    catch e
      warningMsg e
      throw e

  {exists}

export default helpers
