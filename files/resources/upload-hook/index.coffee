import {flow} from "panda-garden"
import {pullFile, dispatch} from "./dispatch"

handler = ({Records}, context, callback) ->
  try
    await do flow [
      -> Records
      pullFile
      dispatch
    ]

    callback null, "success"

  catch e
    console.log e
    callback new Error "upload hook failure"

export {handler}
