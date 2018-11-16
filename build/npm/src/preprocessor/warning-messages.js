"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var msg;

msg = function (e) {
  switch (e.statusCode) {
    case 403:
      return console.error("WARNING: S3 bucket exists, these AWS credentials do not grant\naccess.  Currently, Sky cannot manipulate this bucket.");

    case 301:
      return console.error("WARNING: S3 bucket exists, but is in a Region other than\nspecified in sky.yaml. Currently, Sky cannot manipulate this bucket.");
  }
};

var _default = msg;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByZXByb2Nlc3Nvci93YXJuaW5nLW1lc3NhZ2VzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBLEdBQUE7O0FBQUEsR0FBQSxHQUFNLFVBQUEsQ0FBQSxFQUFBO0FBQ0osVUFBTyxDQUFDLENBQVIsVUFBQTtBQUFBLFNBQUEsR0FBQTthQUVJLE9BQU8sQ0FBUCxLQUFBLENBQUEsdUhBQUEsQzs7QUFGSixTQUFBLEdBQUE7YUFPSSxPQUFPLENBQVAsS0FBQSxDQUFBLGdJQUFBLEM7QUFQSjtBQURJLENBQU47O2VBYWUsRyIsInNvdXJjZXNDb250ZW50IjpbIm1zZyA9IChlKSAtPlxuICBzd2l0Y2ggZS5zdGF0dXNDb2RlXG4gICAgd2hlbiA0MDNcbiAgICAgIGNvbnNvbGUuZXJyb3IgXCJcIlwiXG4gICAgICBXQVJOSU5HOiBTMyBidWNrZXQgZXhpc3RzLCB0aGVzZSBBV1MgY3JlZGVudGlhbHMgZG8gbm90IGdyYW50XG4gICAgICBhY2Nlc3MuICBDdXJyZW50bHksIFNreSBjYW5ub3QgbWFuaXB1bGF0ZSB0aGlzIGJ1Y2tldC5cbiAgICAgIFwiXCJcIlxuICAgIHdoZW4gMzAxXG4gICAgICBjb25zb2xlLmVycm9yIFwiXCJcIlxuICAgICAgV0FSTklORzogUzMgYnVja2V0IGV4aXN0cywgYnV0IGlzIGluIGEgUmVnaW9uIG90aGVyIHRoYW5cbiAgICAgIHNwZWNpZmllZCBpbiBza3kueWFtbC4gQ3VycmVudGx5LCBTa3kgY2Fubm90IG1hbmlwdWxhdGUgdGhpcyBidWNrZXQuXG4gICAgICBcIlwiXCJcblxuZXhwb3J0IGRlZmF1bHQgbXNnXG4iXSwic291cmNlUm9vdCI6IiJ9
//# sourceURL=preprocessor/warning-messages.coffee