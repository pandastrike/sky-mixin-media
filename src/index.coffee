import {resolve} from "path"
import MIXIN from "panda-sky-mixin"
import {read} from "panda-quill"
import {yaml} from "panda-serialize"

import getPolicyStatements from "./policy"
import preprocess from "./preprocessor"
#import cli from "./cli"

getFilePath = (name) -> resolve __dirname, "..", "..", "..", "files", name

mixin = do ->
  schema = yaml await read getFilePath "schema.yaml"
  schema.definitions = yaml await read getFilePath "definitions.yaml"
  template = await read getFilePath "template.yaml"

  Media = new MIXIN {
    name: "media"
    schema
    template
    preprocess
    #cli
    getPolicyStatements
  }
  Media

export default mixin
