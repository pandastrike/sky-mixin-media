"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var Policy;

Policy = function (SDK, global, meta, local) {
  var name, resources;
  ({
    name
  } = local.bucket);
  resources = [`arn:aws:s3:::${name}`, `arn:aws:s3:::${name}/*`, `arn:aws:s3:::${name}-pre`, `arn:aws:s3:::${name}-pre/*`];
  return [{
    Effect: "Allow",
    Action: ["s3:*"],
    Resource: resources
  }];
};

var _default = Policy;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9za3ktbWl4aW4tbWVkaWEvc3JjL3BvbGljeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBQSxNQUFBOztBQUFBLE1BQUEsR0FBUyxVQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQTtBQUNQLE1BQUEsSUFBQSxFQUFBLFNBQUE7QUFBQSxHQUFBO0FBQUEsSUFBQTtBQUFBLE1BQVMsS0FBSyxDQUFkLE1BQUE7QUFDQSxFQUFBLFNBQUEsR0FBWSxDQUNWLGdCQUFBLElBRFUsRUFBQSxFQUVWLGdCQUFBLElBRlUsSUFBQSxFQUdWLGdCQUFBLElBSFUsTUFBQSxFQUlWLGdCQUFBLElBSlUsUUFBQSxDQUFaO1NBT0EsQ0FDRTtBQUFBLElBQUEsTUFBQSxFQUFBLE9BQUE7QUFDQSxJQUFBLE1BQUEsRUFBUSxDQURSLE1BQ1EsQ0FEUjtBQUVBLElBQUEsUUFBQSxFQUFVO0FBRlYsR0FERixDO0FBVE8sQ0FBVDs7ZUFlZSxNIiwic291cmNlc0NvbnRlbnQiOlsiUG9saWN5ID0gKFNESywgZ2xvYmFsLCBtZXRhLCBsb2NhbCkgLT5cbiAge25hbWV9ID0gbG9jYWwuYnVja2V0XG4gIHJlc291cmNlcyA9IFtcbiAgICBcImFybjphd3M6czM6Ojoje25hbWV9XCJcbiAgICBcImFybjphd3M6czM6Ojoje25hbWV9LypcIlxuICAgIFwiYXJuOmF3czpzMzo6OiN7bmFtZX0tcHJlXCJcbiAgICBcImFybjphd3M6czM6Ojoje25hbWV9LXByZS8qXCJcbiAgXVxuXG4gIFtcbiAgICBFZmZlY3Q6IFwiQWxsb3dcIlxuICAgIEFjdGlvbjogWyBcInMzOipcIiBdXG4gICAgUmVzb3VyY2U6IHJlc291cmNlc1xuICBdXG5cbmV4cG9ydCBkZWZhdWx0IFBvbGljeVxuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=/Users/david/repos/sky-mixin-media/src/policy.coffee