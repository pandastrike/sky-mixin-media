import {resolve} from "path"
import {read as _read} from "panda-quill"
import {isEmpty} from "panda-parchment"
import PandaTemplate from "panda-template"

T = new PandaTemplate()
T.handlebars().registerHelper
    isEmpty: (input) -> isEmpty input

read = (name) ->
  await _read resolve __dirname, "..", "..", "..", "files", name

getTemplate = (config) ->
  template = await read "template.yaml"
  T.render template, config

export default getTemplate
