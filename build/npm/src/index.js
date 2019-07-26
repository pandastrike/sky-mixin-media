"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _policy = _interopRequireDefault(require("./policy"));

var _template = _interopRequireDefault(require("./template"));

var _beforeHook = _interopRequireDefault(require("./before-hook"));

var _preprocess = _interopRequireDefault(require("./preprocess"));

var _path = require("path");

var _ajv = _interopRequireDefault(require("ajv"));

var _pandaParchment = require("panda-parchment");

var _pandaQuill = require("panda-quill");

var _pandaSerialize = require("panda-serialize");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ajv, create, read;
ajv = new _ajv.default();

read = async function (name) {
  return await (0, _pandaQuill.read)((0, _path.resolve)(__dirname, "..", "..", "..", "files", name));
};

create = async function (SDK, global, meta, local) {
  var config, schema;
  schema = (0, _pandaSerialize.yaml)((await read("schema.yaml")));
  schema.definitions = (0, _pandaSerialize.yaml)((await read("definitions.yaml")));

  if (!ajv.validate(schema, local)) {
    console.error((0, _pandaParchment.toJSON)(ajv.errors, true));
    throw new Error("failed to validate mixin configuration");
  }

  config = await (0, _preprocess.default)(SDK, global, meta, local);
  return {
    name: "media",
    policy: (0, _policy.default)(SDK, global, meta, local),
    vpc: false,
    template: await (0, _template.default)(config),
    beforeHook: (0, _beforeHook.default)(SDK, global, meta, local, config)
  };
};

var _default = create;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9za3ktbWl4aW4tbWVkaWEvc3JjL2luZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFUQSxJQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsSUFBQTtBQVdBLEdBQUEsR0FBTSxJQUFBLFlBQUEsRUFBTjs7QUFFQSxJQUFBLEdBQU8sZ0JBQUEsSUFBQSxFQUFBO0FBQ0wsU0FBQSxNQUFNLHNCQUFNLG1CQUFBLFNBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxPQUFBLEVBQVosSUFBWSxDQUFOLENBQU47QUFESyxDQUFQOztBQUdBLE1BQUEsR0FBUyxnQkFBQSxHQUFBLEVBQUEsTUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLEVBQUE7QUFDUCxNQUFBLE1BQUEsRUFBQSxNQUFBO0FBQUEsRUFBQSxNQUFBLEdBQVMsMkJBQUssTUFBTSxJQUFBLENBQVgsYUFBVyxDQUFYLEVBQVQ7QUFDQSxFQUFBLE1BQU0sQ0FBTixXQUFBLEdBQXFCLDJCQUFLLE1BQU0sSUFBQSxDQUFYLGtCQUFXLENBQVgsRUFBckI7O0FBQ0EsTUFBQSxDQUFPLEdBQUcsQ0FBSCxRQUFBLENBQUEsTUFBQSxFQUFQLEtBQU8sQ0FBUCxFQUFBO0FBQ0UsSUFBQSxPQUFPLENBQVAsS0FBQSxDQUFjLDRCQUFPLEdBQUcsQ0FBVixNQUFBLEVBQWQsSUFBYyxDQUFkO0FBQ0EsVUFBTSxJQUFBLEtBQUEsQ0FGUix3Q0FFUSxDQUFOOzs7QUFFRixFQUFBLE1BQUEsR0FBUyxNQUFNLHlCQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsSUFBQSxFQUFOLEtBQU0sQ0FBZjtTQUVBO0FBQUEsSUFBQSxJQUFBLEVBQUEsT0FBQTtBQUNBLElBQUEsTUFBQSxFQUFRLHFCQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsSUFBQSxFQURSLEtBQ1EsQ0FEUjtBQUVBLElBQUEsR0FBQSxFQUZBLEtBQUE7QUFHQSxJQUFBLFFBQUEsRUFBVSxNQUFNLHVCQUhoQixNQUdnQixDQUhoQjtBQUlBLElBQUEsVUFBQSxFQUFZLHlCQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQSxNQUFBO0FBSlosRztBQVRPLENBQVQ7O2VBZWUsTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBnZXRQb2xpY3kgZnJvbSBcIi4vcG9saWN5XCJcbmltcG9ydCBnZXRUZW1wbGF0ZSBmcm9tIFwiLi90ZW1wbGF0ZVwiXG5pbXBvcnQgQmVmb3JlSG9vayBmcm9tIFwiLi9iZWZvcmUtaG9va1wiXG5pbXBvcnQgcHJlcHJvY2VzcyBmcm9tIFwiLi9wcmVwcm9jZXNzXCJcblxuaW1wb3J0IHtyZXNvbHZlfSBmcm9tIFwicGF0aFwiXG5pbXBvcnQgQUpWIGZyb20gXCJhanZcIlxuaW1wb3J0IHt0b0pTT059IGZyb20gXCJwYW5kYS1wYXJjaG1lbnRcIlxuaW1wb3J0IHtyZWFkIGFzIF9yZWFkfSBmcm9tIFwicGFuZGEtcXVpbGxcIlxuaW1wb3J0IHt5YW1sfSBmcm9tIFwicGFuZGEtc2VyaWFsaXplXCJcblxuYWp2ID0gbmV3IEFKVigpXG5cbnJlYWQgPSAobmFtZSkgLT5cbiAgYXdhaXQgX3JlYWQgcmVzb2x2ZSBfX2Rpcm5hbWUsIFwiLi5cIiwgXCIuLlwiLCBcIi4uXCIsIFwiZmlsZXNcIiwgbmFtZVxuXG5jcmVhdGUgPSAoU0RLLCBnbG9iYWwsIG1ldGEsIGxvY2FsKSAtPlxuICBzY2hlbWEgPSB5YW1sIGF3YWl0IHJlYWQgXCJzY2hlbWEueWFtbFwiXG4gIHNjaGVtYS5kZWZpbml0aW9ucyA9IHlhbWwgYXdhaXQgcmVhZCBcImRlZmluaXRpb25zLnlhbWxcIlxuICB1bmxlc3MgYWp2LnZhbGlkYXRlIHNjaGVtYSwgbG9jYWxcbiAgICBjb25zb2xlLmVycm9yIHRvSlNPTiBhanYuZXJyb3JzLCB0cnVlXG4gICAgdGhyb3cgbmV3IEVycm9yIFwiZmFpbGVkIHRvIHZhbGlkYXRlIG1peGluIGNvbmZpZ3VyYXRpb25cIlxuXG4gIGNvbmZpZyA9IGF3YWl0IHByZXByb2Nlc3MgU0RLLCBnbG9iYWwsIG1ldGEsIGxvY2FsXG5cbiAgbmFtZTogXCJtZWRpYVwiXG4gIHBvbGljeTogZ2V0UG9saWN5IFNESywgZ2xvYmFsLCBtZXRhLCBsb2NhbFxuICB2cGM6IGZhbHNlXG4gIHRlbXBsYXRlOiBhd2FpdCBnZXRUZW1wbGF0ZSBjb25maWdcbiAgYmVmb3JlSG9vazogQmVmb3JlSG9vayBTREssIGdsb2JhbCwgbWV0YSwgbG9jYWwsIGNvbmZpZ1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVcbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=/Users/david/repos/sky-mixin-media/src/index.coffee