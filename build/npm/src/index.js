"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = require("path");

var _pandaSkyMixin = _interopRequireDefault(require("panda-sky-mixin"));

var _pandaQuill = require("panda-quill");

var _pandaSerialize = require("panda-serialize");

var _policy = _interopRequireDefault(require("./policy"));

var _preprocessor = _interopRequireDefault(require("./preprocessor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getFilePath, mixin;

//import cli from "./cli"
getFilePath = function (name) {
  return (0, _path.resolve)(__dirname, "..", "..", "..", "files", name);
};

mixin = async function () {
  var Media, schema, template;
  schema = (0, _pandaSerialize.yaml)((await (0, _pandaQuill.read)(getFilePath("schema.yaml"))));
  schema.definitions = (0, _pandaSerialize.yaml)((await (0, _pandaQuill.read)(getFilePath("definitions.yaml"))));
  template = await (0, _pandaQuill.read)(getFilePath("template.yaml"));
  Media = new _pandaSkyMixin.default({
    name: "media",
    schema,
    template,
    preprocess: _preprocessor.default,
    //cli
    getPolicyStatements: _policy.default
  });
  return Media;
}();

var _default = mixin;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9za3ktbWl4aW4tbWVkaWEvc3JjL2luZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBTEE7Ozs7QUFBQSxJQUFBLFdBQUEsRUFBQSxLQUFBOzs7QUFTQSxXQUFBLEdBQWMsVUFBQSxJQUFBLEVBQUE7U0FBVSxtQkFBQSxTQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLElBQUEsQztBQUFWLENBQWQ7O0FBRUEsS0FBQSxHQUFXLGtCQUFBO0FBQ1QsTUFBQSxLQUFBLEVBQUEsTUFBQSxFQUFBLFFBQUE7QUFBQSxFQUFBLE1BQUEsR0FBUywyQkFBSyxNQUFNLHNCQUFLLFdBQUEsQ0FBaEIsYUFBZ0IsQ0FBTCxDQUFYLEVBQVQ7QUFDQSxFQUFBLE1BQU0sQ0FBTixXQUFBLEdBQXFCLDJCQUFLLE1BQU0sc0JBQUssV0FBQSxDQUFoQixrQkFBZ0IsQ0FBTCxDQUFYLEVBQXJCO0FBQ0EsRUFBQSxRQUFBLEdBQVcsTUFBTSxzQkFBSyxXQUFBLENBQVgsZUFBVyxDQUFMLENBQWpCO0FBRUEsRUFBQSxLQUFBLEdBQVEsSUFBQSxzQkFBQSxDQUFVO0FBQ2hCLElBQUEsSUFBQSxFQURnQixPQUFBO0FBQUEsSUFBQSxNQUFBO0FBQUEsSUFBQSxRQUFBO0FBSWhCLElBQUEsVUFKZ0IsRUFJaEIscUJBSmdCOztBQU1oQixJQUFBLG1CQUFBLEVBQUE7QUFOZ0IsR0FBVixDQUFSO1NBUUEsSztBQWJNLENBQUcsRUFBWDs7ZUFlZSxLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtyZXNvbHZlfSBmcm9tIFwicGF0aFwiXG5pbXBvcnQgTUlYSU4gZnJvbSBcInBhbmRhLXNreS1taXhpblwiXG5pbXBvcnQge3JlYWR9IGZyb20gXCJwYW5kYS1xdWlsbFwiXG5pbXBvcnQge3lhbWx9IGZyb20gXCJwYW5kYS1zZXJpYWxpemVcIlxuXG5pbXBvcnQgZ2V0UG9saWN5U3RhdGVtZW50cyBmcm9tIFwiLi9wb2xpY3lcIlxuaW1wb3J0IHByZXByb2Nlc3MgZnJvbSBcIi4vcHJlcHJvY2Vzc29yXCJcbiNpbXBvcnQgY2xpIGZyb20gXCIuL2NsaVwiXG5cbmdldEZpbGVQYXRoID0gKG5hbWUpIC0+IHJlc29sdmUgX19kaXJuYW1lLCBcIi4uXCIsIFwiLi5cIiwgXCIuLlwiLCBcImZpbGVzXCIsIG5hbWVcblxubWl4aW4gPSBkbyAtPlxuICBzY2hlbWEgPSB5YW1sIGF3YWl0IHJlYWQgZ2V0RmlsZVBhdGggXCJzY2hlbWEueWFtbFwiXG4gIHNjaGVtYS5kZWZpbml0aW9ucyA9IHlhbWwgYXdhaXQgcmVhZCBnZXRGaWxlUGF0aCBcImRlZmluaXRpb25zLnlhbWxcIlxuICB0ZW1wbGF0ZSA9IGF3YWl0IHJlYWQgZ2V0RmlsZVBhdGggXCJ0ZW1wbGF0ZS55YW1sXCJcblxuICBNZWRpYSA9IG5ldyBNSVhJTiB7XG4gICAgbmFtZTogXCJtZWRpYVwiXG4gICAgc2NoZW1hXG4gICAgdGVtcGxhdGVcbiAgICBwcmVwcm9jZXNzXG4gICAgI2NsaVxuICAgIGdldFBvbGljeVN0YXRlbWVudHNcbiAgfVxuICBNZWRpYVxuXG5leHBvcnQgZGVmYXVsdCBtaXhpblxuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=/Users/david/repos/sky-mixin-media/src/index.coffee