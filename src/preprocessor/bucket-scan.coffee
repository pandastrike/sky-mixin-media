import Sundog from "sundog"
import warningMsg from "./warning-messages"


_S3 = (_AWS_) ->
  {AWS: {S3: {bucketExists}}} = Sundog _AWS_

  exists = (name) ->
    try
      await bucketExists name
    catch e
      warningMsg e
      throw e

  {exists}

export default _S3
