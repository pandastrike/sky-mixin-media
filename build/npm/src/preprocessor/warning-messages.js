"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var msg;

msg = function (e) {
  switch (e.statusCode) {
    case 403:
      return console.error("WARNING: S3 bucket exists, these AWS credentials do not grant\naccess.  Currently, Sky cannot manipulate this bucket.");
    case 301:
      return console.error("WARNING: S3 bucket exists, but is in a Region other than\nspecified in sky.yaml. Currently, Sky cannot manipulate this bucket.");
  }
};

exports.default = msg;