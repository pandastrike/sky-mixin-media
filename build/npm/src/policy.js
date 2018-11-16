"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pandaRiver = require("panda-river");

// Panda Sky Mixin: Media Policy
// This mixin grants the API Lambdas access to the specified S3 buckets.  That IAM Role permission is rolled into your CloudFormation stack after being generated here.
var Policy;

Policy = function (config, global) {
  var i, len, n, names, resources; // Grant total access to the buckets listed in this mixin.
  // TODO: Consider limiting the actions on those buckets and/or how to specify limitations within the mixin configuration.

  names = (0, _pandaRiver.collect)((0, _pandaRiver.project)("name", config.buckets));
  resources = [];

  for (i = 0, len = names.length; i < len; i++) {
    n = names[i];
    resources.push(`arn:aws:s3:::${n}`);
    resources.push(`arn:aws:s3:::${n}/*`);
  }

  return [{
    Effect: "Allow",
    Action: ["s3:*"],
    Resource: resources
  }];
};

var _default = Policy;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBvbGljeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUdBOztBQUhBOztBQUFBLElBQUEsTUFBQTs7QUFLQSxNQUFBLEdBQVMsVUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBO0FBSVAsTUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxLQUFBLEVBQUEsU0FBQSxDQUpPLEM7OztBQUlQLEVBQUEsS0FBQSxHQUFRLHlCQUFRLHlCQUFBLE1BQUEsRUFBZ0IsTUFBTSxDQUE5QixPQUFRLENBQVIsQ0FBUjtBQUNBLEVBQUEsU0FBQSxHQUFZLEVBQVo7O0FBQ0EsT0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsR0FBQSxLQUFBLENBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUE7O0FBQ0UsSUFBQSxTQUFTLENBQVQsSUFBQSxDQUFlLGdCQUFBLENBQWYsRUFBQTtBQUNBLElBQUEsU0FBUyxDQUFULElBQUEsQ0FBZSxnQkFBQSxDQUFmLElBQUE7QUFGRjs7U0FJQSxDQUNFO0FBQUEsSUFBQSxNQUFBLEVBQUEsT0FBQTtBQUNBLElBQUEsTUFBQSxFQUFRLENBRFIsTUFDUSxDQURSO0FBRUEsSUFBQSxRQUFBLEVBQVU7QUFGVixHQURGLEM7QUFWTyxDQUFUOztlQWdCZSxNIiwic291cmNlc0NvbnRlbnQiOlsiIyBQYW5kYSBTa3kgTWl4aW46IE1lZGlhIFBvbGljeVxuIyBUaGlzIG1peGluIGdyYW50cyB0aGUgQVBJIExhbWJkYXMgYWNjZXNzIHRvIHRoZSBzcGVjaWZpZWQgUzMgYnVja2V0cy4gIFRoYXQgSUFNIFJvbGUgcGVybWlzc2lvbiBpcyByb2xsZWQgaW50byB5b3VyIENsb3VkRm9ybWF0aW9uIHN0YWNrIGFmdGVyIGJlaW5nIGdlbmVyYXRlZCBoZXJlLlxuXG5pbXBvcnQge2NvbGxlY3QsIHByb2plY3R9IGZyb20gXCJwYW5kYS1yaXZlclwiXG5cblBvbGljeSA9IChjb25maWcsIGdsb2JhbCkgLT5cbiAgIyBHcmFudCB0b3RhbCBhY2Nlc3MgdG8gdGhlIGJ1Y2tldHMgbGlzdGVkIGluIHRoaXMgbWl4aW4uXG4gICMgVE9ETzogQ29uc2lkZXIgbGltaXRpbmcgdGhlIGFjdGlvbnMgb24gdGhvc2UgYnVja2V0cyBhbmQvb3IgaG93IHRvIHNwZWNpZnkgbGltaXRhdGlvbnMgd2l0aGluIHRoZSBtaXhpbiBjb25maWd1cmF0aW9uLlxuXG4gIG5hbWVzID0gY29sbGVjdCBwcm9qZWN0IFwibmFtZVwiLCBjb25maWcuYnVja2V0c1xuICByZXNvdXJjZXMgPSBbXVxuICBmb3IgbiBpbiBuYW1lc1xuICAgIHJlc291cmNlcy5wdXNoIFwiYXJuOmF3czpzMzo6OiN7bn1cIlxuICAgIHJlc291cmNlcy5wdXNoIFwiYXJuOmF3czpzMzo6OiN7bn0vKlwiXG5cbiAgW1xuICAgIEVmZmVjdDogXCJBbGxvd1wiXG4gICAgQWN0aW9uOiBbIFwiczM6KlwiIF1cbiAgICBSZXNvdXJjZTogcmVzb3VyY2VzXG4gIF1cblxuZXhwb3J0IGRlZmF1bHQgUG9saWN5XG4iXSwic291cmNlUm9vdCI6IiJ9
//# sourceURL=policy.coffee