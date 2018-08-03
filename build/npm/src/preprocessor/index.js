"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fairmont = require("fairmont");

var _url = require("./url");

var _acm = require("./acm");

var _acm2 = _interopRequireDefault(_acm);

var _bucketScan = require("./bucket-scan");

var _bucketScan2 = _interopRequireDefault(_bucketScan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// Panda Sky Mixin: Media
// This mixin allocates a variety of AWS resources to setup a media server for your app.  That includes an S3 bucket that can accept multipart uploads (via signed URLs) and public reads.  There is also an edge-cached CDN to get that all to the edge.
var process;

process = (() => {
  var _ref = _asyncToGenerator(function* (_AWS_, config) {
    var b, buckets, c, edges, env, exists, fetchCertificate, hostname, i, j, len, len1, needed, tags;
    ({
      fetch: fetchCertificate
    } = (0, _acm2.default)(_AWS_));
    ({ exists } = (0, _bucketScan2.default)(_AWS_));
    // Start by extracting out the Media Mixin configuration:
    ({ env, tags = [] } = config);
    c = config.aws.environments[env].mixins.media;
    c = (0, _fairmont.isObject)(c) ? c : {};
    c.tags = (0, _fairmont.cat)(c.tags || [], tags);
    ({ buckets = [], tags } = c);
    // Only specify an S3 bucket if it does not already exist.
    needed = [];
    for (i = 0, len = buckets.length; i < len; i++) {
      b = buckets[i];
      if (!(yield exists(b.name))) {
        needed.push({
          resourceTitle: (0, _fairmont.capitalize)((0, _fairmont.camelCase)((0, _fairmont.plainText)(b.name))),
          name: b.name,
          expires: b.expires,
          tags
        });
      }
    }
    // For every possible bucket, specify the CloudFormation + Route53 stack that forms its CDN edge.
    edges = [];
    for (j = 0, len1 = buckets.length; j < len1; j++) {
      b = buckets[j];
      hostname = b.hostname + "." + config.aws.domain;
      edges.push({
        resourceTitle: (0, _fairmont.capitalize)((0, _fairmont.camelCase)((0, _fairmont.plainText)(b.name))),
        hostname,
        expires: b.expires,
        priceClass: "PriceClass_" + (b.priceClass || 100),
        bucketDomainName: `${b.name}.s3.amazonaws.com`,
        certificate: yield fetchCertificate(hostname),
        hostedzone: (0, _url.root)(hostname),
        tags
      });
    }
    return {
      // Output configuration to be used by the Media template.
      buckets: needed,
      edges
    };
  });

  return function process(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

exports.default = process;