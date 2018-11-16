"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pandaParchment = require("panda-parchment");

var _sundog = _interopRequireDefault(require("sundog"));

var _bucketScan = _interopRequireDefault(require("./bucket-scan"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Panda Sky Mixin: Media
// This mixin allocates a variety of AWS resources to setup a media server for your app.  That includes an S3 bucket that can accept multipart uploads (via signed URLs) and public reads.  There is also an edge-cached CDN to get that all to the edge.
var process;

process = async function (SDK, config) {
  var ACM, _fetch, b, buckets, c, edges, env, exists, fetch, hostname, i, j, len, len1, needed, root, tags, waf, wafDefaults;

  ({
    AWS: {
      ACM,
      URL: {
        root
      }
    }
  } = (0, _sundog.default)(SDK));
  ({
    fetch
  } = ACM({
    region: "us-east-1" // we always store certs here

  }));
  ({
    exists
  } = await (0, _bucketScan.default)(SDK, config));

  _fetch = async function (name) {
    var cert;

    if (cert = await fetch(hostname)) {
      return cert;
    } else {
      throw new Error(`Unable to locate wildcard cert for ${name}`);
    }
  };

  wafDefaults = function (global, local) {
    var out;
    out = (0, _pandaParchment.merge)(global, local != null ? local : {});

    if (out.floodThreshold == null) {
      out.floodThreshold = 2000;
    }

    if (out.errorThreshold == null) {
      out.errorThreshold = 50;
    }

    if (out.blockTTL == null) {
      out.blockTTL = 240;
    }

    return out;
  }; // Start by extracting out the Media Mixin configuration:


  ({
    env,
    tags = []
  } = config);
  c = config.aws.environments[env].mixins.media;
  c = (0, _pandaParchment.isObject)(c) ? c : {};
  c.tags = (0, _pandaParchment.cat)(c.tags || [], tags);
  ({
    buckets = [],
    tags,
    waf = {}
  } = c); // Only specify an S3 bucket if it does not already exist.

  needed = [];

  for (i = 0, len = buckets.length; i < len; i++) {
    b = buckets[i];

    if (!(await exists(b.name))) {
      needed.push({
        resourceTitle: (0, _pandaParchment.capitalize)((0, _pandaParchment.camelCase)((0, _pandaParchment.plainText)(b.name))),
        name: b.name,
        expires: b.expires,
        tags
      });
    }
  } // For every possible bucket, specify the CloudFormation + Route53 stack that forms its CDN edge.


  edges = [];

  for (j = 0, len1 = buckets.length; j < len1; j++) {
    b = buckets[j];
    hostname = b.hostname + "." + config.aws.domain;
    edges.push({
      resourceTitle: (0, _pandaParchment.capitalize)((0, _pandaParchment.camelCase)((0, _pandaParchment.plainText)(b.name))),
      hostname,
      expires: b.expires,
      priceClass: "PriceClass_" + (b.priceClass || 100),
      bucketDomainName: `${b.name}.s3.amazonaws.com`,
      certificate: await _fetch(hostname),
      hostedzone: root(hostname),
      logBucket: `${b.name}-cflogs`,
      waf: wafDefaults(waf, b.waf),
      tags
    });
  }

  return {
    // Output configuration to be used by the Media template.
    buckets: needed,
    edges,
    rootName: `${config.environmentVariables.fullName}-media`,
    skyBucket: config.environmentVariables.skyBucket
  };
};

var _default = process;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByZXByb2Nlc3Nvci9pbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUdBOztBQUNBOztBQUNBOzs7O0FBTEE7O0FBQUEsSUFBQSxPQUFBOztBQU9BLE9BQUEsR0FBVSxnQkFBQSxHQUFBLEVBQUEsTUFBQSxFQUFBO0FBQ1IsTUFBQSxHQUFBLEVBQUEsTUFBQSxFQUFBLENBQUEsRUFBQSxPQUFBLEVBQUEsQ0FBQSxFQUFBLEtBQUEsRUFBQSxHQUFBLEVBQUEsTUFBQSxFQUFBLEtBQUEsRUFBQSxRQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxXQUFBOztBQUFBLEdBQUE7QUFBQyxJQUFBLEdBQUEsRUFBSztBQUFBLE1BQUEsR0FBQTtBQUFNLE1BQUEsR0FBQSxFQUFJO0FBQUEsUUFBQTtBQUFBO0FBQVY7QUFBTixNQUEyQixxQkFBM0IsR0FBMkIsQ0FBM0I7QUFDQSxHQUFBO0FBQUEsSUFBQTtBQUFBLE1BQVUsR0FBQSxDQUFJO0FBQUEsSUFBQSxNQUFBLEVBQUEsV0FBQSxDQUFBOztBQUFBLEdBQUosQ0FBVjtBQUNBLEdBQUE7QUFBQSxJQUFBO0FBQUEsTUFBVyxNQUFNLHlCQUFBLEdBQUEsRUFBakIsTUFBaUIsQ0FBakI7O0FBRUEsRUFBQSxNQUFBLEdBQVMsZ0JBQUEsSUFBQSxFQUFBO0FBQ1AsUUFBQSxJQUFBOztBQUFBLFFBQUcsSUFBQSxHQUFPLE1BQU0sS0FBQSxDQUFoQixRQUFnQixDQUFoQixFQUFBO2FBQUEsSTtBQUFBLEtBQUEsTUFBQTtBQUdFLFlBQU0sSUFBQSxLQUFBLENBQVUsc0NBQUEsSUFIbEIsRUFHUSxDQUFOOztBQUpLLEdBQVQ7O0FBTUEsRUFBQSxXQUFBLEdBQWMsVUFBQSxNQUFBLEVBQUEsS0FBQSxFQUFBO0FBQ1osUUFBQSxHQUFBO0FBQUEsSUFBQSxHQUFBLEdBQU0sMkJBQUEs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dXJjZXNDb250ZW50IjpbIiMgUGFuZGEgU2t5IE1peGluOiBNZWRpYVxuIyBUaGlzIG1peGluIGFsbG9jYXRlcyBhIHZhcmlldHkgb2YgQVdTIHJlc291cmNlcyB0byBzZXR1cCBhIG1lZGlhIHNlcnZlciBmb3IgeW91ciBhcHAuICBUaGF0IGluY2x1ZGVzIGFuIFMzIGJ1Y2tldCB0aGF0IGNhbiBhY2NlcHQgbXVsdGlwYXJ0IHVwbG9hZHMgKHZpYSBzaWduZWQgVVJMcykgYW5kIHB1YmxpYyByZWFkcy4gIFRoZXJlIGlzIGFsc28gYW4gZWRnZS1jYWNoZWQgQ0ROIHRvIGdldCB0aGF0IGFsbCB0byB0aGUgZWRnZS5cblxuaW1wb3J0IHtjYXQsIGlzT2JqZWN0LCBwbGFpblRleHQsIGNhbWVsQ2FzZSwgY2FwaXRhbGl6ZSwgbWVyZ2V9IGZyb20gXCJwYW5kYS1wYXJjaG1lbnRcIlxuaW1wb3J0IFN1bmRvZyBmcm9tIFwic3VuZG9nXCJcbmltcG9ydCBTMyBmcm9tIFwiLi9idWNrZXQtc2NhblwiXG5cbnByb2Nlc3MgPSAoU0RLLCBjb25maWcpIC0+XG4gIHtBV1M6IHtBQ00sIFVSTDp7cm9vdH19fSA9IFN1bmRvZyBTREtcbiAge2ZldGNofSA9IEFDTSByZWdpb246IFwidXMtZWFzdC0xXCIgIyB3ZSBhbHdheXMgc3RvcmUgY2VydHMgaGVyZVxuICB7ZXhpc3RzfSA9IGF3YWl0IFMzIFNESywgY29uZmlnXG5cbiAgX2ZldGNoID0gKG5hbWUpIC0+XG4gICAgaWYgY2VydCA9IGF3YWl0IGZldGNoIGhvc3RuYW1lXG4gICAgICBjZXJ0XG4gICAgZWxzZVxuICAgICAgdGhyb3cgbmV3IEVycm9yIFwiVW5hYmxlIHRvIGxvY2F0ZSB3aWxkY2FyZCBjZXJ0IGZvciAje25hbWV9XCJcblxuICB3YWZEZWZhdWx0cyA9IChnbG9iYWwsIGxvY2FsKSAtPlxuICAgIG91dCA9IG1lcmdlIGdsb2JhbCwgKGxvY2FsID8ge30pXG4gICAgb3V0LmZsb29kVGhyZXNob2xkID89IDIwMDBcbiAgICBvdXQuZXJyb3JUaHJlc2hvbGQgPz0gNTBcbiAgICBvdXQuYmxvY2tUVEwgPz0gMjQwXG4gICAgb3V0XG5cbiAgIyBTdGFydCBieSBleHRyYWN0aW5nIG91dCB0aGUgTWVkaWEgTWl4aW4gY29uZmlndXJhdGlvbjpcbiAge2VudiwgdGFncz1bXX0gPSBjb25maWdcbiAgYyA9IGNvbmZpZy5hd3MuZW52aXJvbm1lbnRzW2Vudl0ubWl4aW5zLm1lZGlhXG4gIGMgPSBpZiBpc09iamVjdCBjIHRoZW4gYyBlbHNlIHt9XG4gIGMudGFncyA9IGNhdCAoYy50YWdzIHx8IFtdKSwgdGFnc1xuXG4gIHtidWNrZXRzPVtdLCB0YWdzLCB3YWY9e319ID0gY1xuXG4gICMgT25seSBzcGVjaWZ5IGFuIFMzIGJ1Y2tldCBpZiBpdCBkb2VzIG5vdCBhbHJlYWR5IGV4aXN0LlxuICBuZWVkZWQgPSBbXVxuICBmb3IgYiBpbiBidWNrZXRzIHdoZW4gIShhd2FpdCBleGlzdHMgYi5uYW1lKVxuICAgIG5lZWRlZC5wdXNoIHtcbiAgICAgIHJlc291cmNlVGl0bGU6IGNhcGl0YWxpemUgY2FtZWxDYXNlIHBsYWluVGV4dCBiLm5hbWVcbiAgICAgIG5hbWU6IGIubmFtZVxuICAgICAgZXhwaXJlczogYi5leHBpcmVzXG4gICAgICB0YWdzXG4gICAgfVxuXG4gICMgRm9yIGV2ZXJ5IHBvc3NpYmxlIGJ1Y2tldCwgc3BlY2lmeSB0aGUgQ2xvdWRGb3JtYXRpb24gKyBSb3V0ZTUzIHN0YWNrIHRoYXQgZm9ybXMgaXRzIENETiBlZGdlLlxuICBlZGdlcyA9IFtdXG4gIGZvciBiIGluIGJ1Y2tldHNcbiAgICBob3N0bmFtZSA9IGIuaG9zdG5hbWUgKyBcIi5cIiArIGNvbmZpZy5hd3MuZG9tYWluXG4gICAgZWRnZXMucHVzaCB7XG4gICAgICByZXNvdXJjZVRpdGxlOiBjYXBpdGFsaXplIGNhbWVsQ2FzZSBwbGFpblRleHQgYi5uYW1lXG4gICAgICBob3N0bmFtZVxuICAgICAgZXhwaXJlczogYi5leHBpcmVzXG4gICAgICBwcmljZUNsYXNzOiBcIlByaWNlQ2xhc3NfXCIgKyAoYi5wcmljZUNsYXNzIHx8IDEwMClcbiAgICAgIGJ1Y2tldERvbWFpbk5hbWU6IFwiI3tiLm5hbWV9LnMzLmFtYXpvbmF3cy5jb21cIlxuICAgICAgY2VydGlmaWNhdGU6IGF3YWl0IF9mZXRjaCBob3N0bmFtZVxuICAgICAgaG9zdGVkem9uZTogcm9vdCBob3N0bmFtZVxuICAgICAgbG9nQnVja2V0OiBcIiN7Yi5uYW1lfS1jZmxvZ3NcIlxuICAgICAgd2FmOiB3YWZEZWZhdWx0cyB3YWYsIGIud2FmXG4gICAgICB0YWdzXG4gICAgfVxuXG5cbiAgIyBPdXRwdXQgY29uZmlndXJhdGlvbiB0byBiZSB1c2VkIGJ5IHRoZSBNZWRpYSB0ZW1wbGF0ZS5cbiAge1xuICAgIGJ1Y2tldHM6IG5lZWRlZFxuICAgIGVkZ2VzXG4gICAgcm9vdE5hbWU6IFwiI3tjb25maWcuZW52aXJvbm1lbnRWYXJpYWJsZXMuZnVsbE5hbWV9LW1lZGlhXCJcbiAgICBza3lCdWNrZXQ6IGNvbmZpZy5lbnZpcm9ubWVudFZhcmlhYmxlcy5za3lCdWNrZXRcbiAgfVxuXG5cbmV4cG9ydCBkZWZhdWx0IHByb2Nlc3NcbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=preprocessor/index.coffee