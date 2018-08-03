"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sundog = require("sundog");

var _sundog2 = _interopRequireDefault(_sundog);

var _warningMessages = require("./warning-messages");

var _warningMessages2 = _interopRequireDefault(_warningMessages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _S3;

_S3 = function (_AWS_) {
  var bucketExists, exists;
  ({
    AWS: {
      S3: { bucketExists }
    }
  } = (0, _sundog2.default)(_AWS_));
  exists = (() => {
    var _ref = _asyncToGenerator(function* (name) {
      var e;
      try {
        return yield bucketExists(name);
      } catch (error) {
        e = error;
        (0, _warningMessages2.default)(e);
        throw e;
      }
    });

    return function exists(_x) {
      return _ref.apply(this, arguments);
    };
  })();
  return { exists };
};

exports.default = _S3;