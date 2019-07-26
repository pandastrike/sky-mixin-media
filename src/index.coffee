import getPolicy from "./policy"
import getTemplate from "./template"
import BeforeHook from "./before-hook"
import preprocess from "./preprocess"

import {resolve} from "path"
import AJV from "ajv"
import {toJSON} from "panda-parchment"
import {read as _read} from "panda-quill"
import {yaml} from "panda-serialize"

ajv = new AJV()

read = (name) ->
  await _read resolve __dirname, "..", "..", "..", "files", name

create = (SDK, global, meta, local) ->
  schema = yaml await read "schema.yaml"
  schema.definitions = yaml await read "definitions.yaml"
  unless ajv.validate schema, local
    console.error toJSON ajv.errors, true
    throw new Error "failed to validate mixin configuration"

  config = await preprocess SDK, global, meta, local

  name: "media"
  policy: getPolicy SDK, global, meta, local
  vpc: false
  template: await getTemplate config
  beforeHook: BeforeHook SDK, global, meta, local, config

export default create
