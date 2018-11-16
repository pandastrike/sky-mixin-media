"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = require("path");

var _sundog = _interopRequireDefault(require("sundog"));

var _warningMessages = _interopRequireDefault(require("./warning-messages"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _S3;

_S3 = async function (SDK, config) {
  var S3, exists, s3;
  ({
    AWS: {
      S3
    }
  } = (0, _sundog.default)(SDK));
  s3 = S3(); // Push our altered version of the WAF template to the orchestration bucket.  We need this becuase nested stack names are too long to be used as WAF Rule names, as the version published by AWS tries to do.  Work on not needing to do this.

  await s3.bucketTouch(config.environmentVariables.skyBucket);
  await s3.put(config.environmentVariables.skyBucket, "mixin-code/media/waf.json", (0, _path.resolve)(__dirname, "..", "..", "..", "..", "files", "waf.json"), false);

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

var _default = _S3;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByZXByb2Nlc3Nvci9idWNrZXQtc2Nhbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7O0FBRkEsSUFBQSxHQUFBOztBQUtBLEdBQUEsR0FBTSxnQkFBQSxHQUFBLEVBQUEsTUFBQSxFQUFBO0FBQ0osTUFBQSxFQUFBLEVBQUEsTUFBQSxFQUFBLEVBQUE7QUFBQSxHQUFBO0FBQUMsSUFBQSxHQUFBLEVBQUs7QUFBQSxNQUFBO0FBQUE7QUFBTixNQUFjLHFCQUFkLEdBQWMsQ0FBZDtBQUNBLEVBQUEsRUFBQSxHQUFLLEVBREwsRUFDQSxDQUZJLEM7O0FBS0osUUFBTSxFQUFFLENBQUYsV0FBQSxDQUFlLE1BQU0sQ0FBQyxvQkFBUCxDQUFmLFNBQUEsQ0FBTjtBQUNBLFFBQU0sRUFBRSxDQUFGLEdBQUEsQ0FBTyxNQUFNLENBQUMsb0JBQVAsQ0FBUCxTQUFBLEVBQUEsMkJBQUEsRUFBNEUsbUJBQUEsU0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxPQUFBLEVBQTVFLFVBQTRFLENBQTVFLEVBQUEsS0FBQSxDQUFOOztBQUVBLEVBQUEsTUFBQSxHQUFTLGdCQUFBLElBQUEsRUFBQTtBQUNQLFFBQUEsQ0FBQTs7QUFBQSxRQUFBO0FBQ0UsYUFBQSxNQUFNLEVBQUUsQ0FBRixZQUFBLENBRFIsSUFDUSxDQUFOO0FBREYsS0FBQSxDQUFBLE9BQUEsS0FBQSxFQUFBO0FBRU0sTUFBQSxDQUFBLEdBQUEsS0FBQTtBQUNKLG9DQUFBLENBQUE7QUFDQSxZQUpGLENBSUU7O0FBTEssR0FBVDs7U0FPQTtBQUFBLElBQUE7QUFBQSxHO0FBZkksQ0FBTjs7ZUFpQmUsRyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7cmVzb2x2ZX0gZnJvbSBcInBhdGhcIlxuaW1wb3J0IFN1bmRvZyBmcm9tIFwic3VuZG9nXCJcbmltcG9ydCB3YXJuaW5nTXNnIGZyb20gXCIuL3dhcm5pbmctbWVzc2FnZXNcIlxuXG5cbl9TMyA9IChTREssIGNvbmZpZykgLT5cbiAge0FXUzoge1MzfX0gPSBTdW5kb2cgU0RLXG4gIHMzID0gUzMoKVxuXG4gICMgUHVzaCBvdXIgYWx0ZXJlZCB2ZXJzaW9uIG9mIHRoZSBXQUYgdGVtcGxhdGUgdG8gdGhlIG9yY2hlc3RyYXRpb24gYnVja2V0LiAgV2UgbmVlZCB0aGlzIGJlY3Vhc2UgbmVzdGVkIHN0YWNrIG5hbWVzIGFyZSB0b28gbG9uZyB0byBiZSB1c2VkIGFzIFdBRiBSdWxlIG5hbWVzLCBhcyB0aGUgdmVyc2lvbiBwdWJsaXNoZWQgYnkgQVdTIHRyaWVzIHRvIGRvLiAgV29yayBvbiBub3QgbmVlZGluZyB0byBkbyB0aGlzLlxuICBhd2FpdCBzMy5idWNrZXRUb3VjaCBjb25maWcuZW52aXJvbm1lbnRWYXJpYWJsZXMuc2t5QnVja2V0XG4gIGF3YWl0IHMzLnB1dCBjb25maWcuZW52aXJvbm1lbnRWYXJpYWJsZXMuc2t5QnVja2V0LCBcIm1peGluLWNvZGUvbWVkaWEvd2FmLmpzb25cIiwgKHJlc29sdmUgX19kaXJuYW1lLCBcIi4uXCIsIFwiLi5cIiwgXCIuLlwiLCBcIi4uXCIsIFwiZmlsZXNcIiwgXCJ3YWYuanNvblwiKSwgZmFsc2VcblxuICBleGlzdHMgPSAobmFtZSkgLT5cbiAgICB0cnlcbiAgICAgIGF3YWl0IHMzLmJ1Y2tldEV4aXN0cyBuYW1lXG4gICAgY2F0Y2ggZVxuICAgICAgd2FybmluZ01zZyBlXG4gICAgICB0aHJvdyBlXG5cbiAge2V4aXN0c31cblxuZXhwb3J0IGRlZmF1bHQgX1MzXG4iXSwic291cmNlUm9vdCI6IiJ9
//# sourceURL=preprocessor/bucket-scan.coffee