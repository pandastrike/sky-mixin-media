"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = require("path");

var _sundog = _interopRequireDefault(require("sundog"));

var _warningMessages = _interopRequireDefault(require("./warning-messages"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var helpers;

helpers = function (SDK, config) {
  var S3, exists, s3;
  ({
    AWS: {
      S3
    }
  } = (0, _sundog.default)(SDK));
  s3 = S3();

  exists = async function (name) {
    var e;

    try {
      return await s3.bucketExists(name);
    } catch (error) {
      e = error;
      (0, _warningMessages.default)(e);
      throw e;
    }
  };

  return {
    exists
  };
};

var _default = helpers;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByZXByb2Nlc3Nvci9idWNrZXQtc2Nhbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7O0FBRkEsSUFBQSxPQUFBOztBQUtBLE9BQUEsR0FBVSxVQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUE7QUFDUixNQUFBLEVBQUEsRUFBQSxNQUFBLEVBQUEsRUFBQTtBQUFBLEdBQUE7QUFBQyxJQUFBLEdBQUEsRUFBSztBQUFBLE1BQUE7QUFBQTtBQUFOLE1BQWMscUJBQWQsR0FBYyxDQUFkO0FBQ0EsRUFBQSxFQUFBLEdBQUssRUFBQSxFQUFMOztBQUVBLEVBQUEsTUFBQSxHQUFTLGdCQUFBLElBQUEsRUFBQTtBQUNQLFFBQUEsQ0FBQTs7QUFBQSxRQUFBO0FBQ0UsYUFBQSxNQUFNLEVBQUUsQ0FBRixZQUFBLENBRFIsSUFDUSxDQUFOO0FBREYsS0FBQSxDQUFBLE9BQUEsS0FBQSxFQUFBO0FBRU0sTUFBQSxDQUFBLEdBQUEsS0FBQTtBQUNKLG9DQUFBLENBQUE7QUFDQSxZQUpGLENBSUU7O0FBTEssR0FBVDs7U0FPQTtBQUFBLElBQUE7QUFBQSxHO0FBWFEsQ0FBVjs7ZUFhZSxPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtyZXNvbHZlfSBmcm9tIFwicGF0aFwiXG5pbXBvcnQgU3VuZG9nIGZyb20gXCJzdW5kb2dcIlxuaW1wb3J0IHdhcm5pbmdNc2cgZnJvbSBcIi4vd2FybmluZy1tZXNzYWdlc1wiXG5cblxuaGVscGVycyA9IChTREssIGNvbmZpZykgLT5cbiAge0FXUzoge1MzfX0gPSBTdW5kb2cgU0RLXG4gIHMzID0gUzMoKVxuXG4gIGV4aXN0cyA9IChuYW1lKSAtPlxuICAgIHRyeVxuICAgICAgYXdhaXQgczMuYnVja2V0RXhpc3RzIG5hbWVcbiAgICBjYXRjaCBlXG4gICAgICB3YXJuaW5nTXNnIGVcbiAgICAgIHRocm93IGVcblxuICB7ZXhpc3RzfVxuXG5leHBvcnQgZGVmYXVsdCBoZWxwZXJzXG4iXSwic291cmNlUm9vdCI6IiJ9
//# sourceURL=preprocessor/bucket-scan.coffee