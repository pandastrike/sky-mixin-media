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
  var name, resources; // Grant total access to the buckets listed in this mixin.
  // TODO: Consider limiting the actions on those buckets and/or how to specify limitations within the mixin configuration.

  ({
    name
  } = config.bucket);
  resources = [`arn:aws:s3:::${name}-pre`, `arn:aws:s3:::${name}-pre/*`];
  return [{
    Effect: "Allow",
    Action: ["s3:*"],
    Resource: resources
  }];
};

var _default = Policy;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9za3ktbWl4aW4tbWVkaWEvc3JjL3BvbGljeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUdBOztBQUhBOztBQUFBLElBQUEsTUFBQTs7QUFLQSxNQUFBLEdBQVMsVUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBO0FBSVAsTUFBQSxJQUFBLEVBQUEsU0FBQSxDQUpPLEM7OztBQUlQLEdBQUE7QUFBQSxJQUFBO0FBQUEsTUFBUyxNQUFNLENBQWYsTUFBQTtBQUNBLEVBQUEsU0FBQSxHQUFZLENBQ1YsZ0JBQUEsSUFEVSxNQUFBLEVBRVYsZ0JBQUEsSUFGVSxRQUFBLENBQVo7U0FLQSxDQUNFO0FBQUEsSUFBQSxNQUFBLEVBQUEsT0FBQTtBQUNBLElBQUEsTUFBQSxFQUFRLENBRFIsTUFDUSxDQURSO0FBRUEsSUFBQSxRQUFBLEVBQVU7QUFGVixHQURGLEM7QUFWTyxDQUFUOztlQWdCZSxNIiwic291cmNlc0NvbnRlbnQiOlsiIyBQYW5kYSBTa3kgTWl4aW46IE1lZGlhIFBvbGljeVxuIyBUaGlzIG1peGluIGdyYW50cyB0aGUgQVBJIExhbWJkYXMgYWNjZXNzIHRvIHRoZSBzcGVjaWZpZWQgUzMgYnVja2V0cy4gIFRoYXQgSUFNIFJvbGUgcGVybWlzc2lvbiBpcyByb2xsZWQgaW50byB5b3VyIENsb3VkRm9ybWF0aW9uIHN0YWNrIGFmdGVyIGJlaW5nIGdlbmVyYXRlZCBoZXJlLlxuXG5pbXBvcnQge2NvbGxlY3QsIHByb2plY3R9IGZyb20gXCJwYW5kYS1yaXZlclwiXG5cblBvbGljeSA9IChjb25maWcsIGdsb2JhbCkgLT5cbiAgIyBHcmFudCB0b3RhbCBhY2Nlc3MgdG8gdGhlIGJ1Y2tldHMgbGlzdGVkIGluIHRoaXMgbWl4aW4uXG4gICMgVE9ETzogQ29uc2lkZXIgbGltaXRpbmcgdGhlIGFjdGlvbnMgb24gdGhvc2UgYnVja2V0cyBhbmQvb3IgaG93IHRvIHNwZWNpZnkgbGltaXRhdGlvbnMgd2l0aGluIHRoZSBtaXhpbiBjb25maWd1cmF0aW9uLlxuXG4gIHtuYW1lfSA9IGNvbmZpZy5idWNrZXRcbiAgcmVzb3VyY2VzID0gW1xuICAgIFwiYXJuOmF3czpzMzo6OiN7bmFtZX0tcHJlXCJcbiAgICBcImFybjphd3M6czM6Ojoje25hbWV9LXByZS8qXCJcbiAgXVxuXG4gIFtcbiAgICBFZmZlY3Q6IFwiQWxsb3dcIlxuICAgIEFjdGlvbjogWyBcInMzOipcIiBdXG4gICAgUmVzb3VyY2U6IHJlc291cmNlc1xuICBdXG5cbmV4cG9ydCBkZWZhdWx0IFBvbGljeVxuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=/Users/david/repos/sky-mixin-media/src/policy.coffee