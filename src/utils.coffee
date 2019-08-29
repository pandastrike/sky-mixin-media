import {spawn} from "child_process"
import {parse as _parse, relative, join, resolve as resolvePath} from "path"
import {w} from "panda-parchment"

print = (_process) ->
  new Promise (resolve, reject) ->
    _process.stdout.on "data", (data) -> process.stdout.write data.toString()
    _process.stderr.on "data", (data) -> process.stderr.write data.toString()
    _process.on "error", (error) ->
      console.error error
      reject()
    _process.on "close", (exitCode) ->
      if exitCode == 0
        resolve()
      else
        console.error "Exited with non-zero code, #{exitCode}"
        reject()


shell = (str, path="", env) ->
  [command, args...] = w str

  options = cwd: resolvePath process.cwd(), path
  options.env = env if env?

  await print await spawn command, args, options

export {shell}
