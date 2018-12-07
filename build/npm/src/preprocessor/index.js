"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pandaParchment = require("panda-parchment");

var _sundog = _interopRequireDefault(require("sundog"));

var _bucketScan = _interopRequireDefault(require("./bucket-scan"));

var _bucketResources = _interopRequireDefault(require("./bucket-resources"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Panda Sky Mixin: Media
// This mixin allocates a variety of AWS resources to setup a media server for your app.  That includes an S3 bucket that can accept multipart uploads (via signed URLs) and public reads.  There is also an edge-cached CDN to get that all to the edge.
var process;

process = async function (SDK, config) {
  var ACM, _fetch, bucket, c, env, exists, fetch, hostname, ref, ref1, root, tags, wafDefaults;

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
  await (0, _bucketResources.default)(SDK, config);

  _fetch = async function (name) {
    var cert;

    if (cert = await fetch(name)) {
      return cert;
    } else {
      throw new Error(`Unable to locate wildcard cert for ${name}`);
    }
  };

  wafDefaults = function (out = {}) {
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
  tags = (0, _pandaParchment.cat)(c.tags || [], tags);
  bucket = (ref = c.bucket) != null ? ref : {}; // Expand the configuration for whole CDN stack.

  hostname = bucket.hostname + "." + config.aws.domain;
  bucket = (0, _pandaParchment.merge)(bucket, {
    new: !(await exists(bucket.name)),
    preprocessing: bucket.name + "-pre",
    hostname,
    bucketURL: `${bucket.name}.s3.amazonaws.com`,
    expires: (ref1 = bucket.expires) != null ? ref1 : 60,
    certificate: await _fetch(hostname),
    priceClass: "PriceClass_" + (bucket.priceClass || 100),
    hostedzone: root(hostname),
    logBucket: `${bucket.name}-cflogs`,
    waf: wafDefaults(bucket.waf),
    optimization: bucket.optimization,
    tags
  });
  return {
    // Output configuration to be used by the Media template.
    bucket,
    name: `${config.environmentVariables.fullName}-media`,
    skyBucket: config.environmentVariables.skyBucket
  };
};

var _default = process;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByZXByb2Nlc3Nvci9pbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUdBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBTkE7O0FBQUEsSUFBQSxPQUFBOztBQVFBLE9BQUEsR0FBVSxnQkFBQSxHQUFBLEVBQUEsTUFBQSxFQUFBO0FBQ1IsTUFBQSxHQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLE1BQUEsRUFBQSxLQUFBLEVBQUEsUUFBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxXQUFBOztBQUFBLEdBQUE7QUFBQyxJQUFBLEdBQUEsRUFBSztBQUFBLE1BQUEsR0FBQTtBQUFNLE1BQUEsR0FBQSxFQUFJO0FBQUEsUUFBQTtBQUFBO0FBQVY7QUFBTixNQUEyQixxQkFBM0IsR0FBMkIsQ0FBM0I7QUFDQSxHQUFBO0FBQUEsSUFBQTtBQUFBLE1BQVUsR0FBQSxDQUFJO0FBQUEsSUFBQSxNQUFBLEVBQUEsV0FBQSxDQUFBOztBQUFBLEdBQUosQ0FBVjtBQUNBLEdBQUE7QUFBQSxJQUFBO0FBQUEsTUFBVyxNQUFNLHlCQUFBLEdBQUEsRUFBakIsTUFBaUIsQ0FBakI7QUFDQSxRQUFNLDhCQUFBLEdBQUEsRUFBQSxNQUFBLENBQU47O0FBRUEsRUFBQSxNQUFBLEdBQVMsZ0JBQUEsSUFBQSxFQUFBO0FBQ1AsUUFBQSxJQUFBOztBQUFBLFFBQUcsSUFBQSxHQUFPLE1BQU0sS0FBQSxDQUFoQixJQUFnQixDQUFoQixFQUFBO2FBQUEsSTtBQUFBLEtBQUEsTUFBQTtBQUdFLFlBQU0sSUFBQSxLQUFBLENBQVUsc0NBQUEsSUFIbEIsRUFHUSxDQUFOOztBQUpLLEdBQVQ7O0FBTUEsRUFBQSxXQUFBLEdBQWMsVUFBQyxHQUFBLEdBQUQsRUFBQSxFQUFBOztBQUNaLE1BQUEsR0FBRyxDQUFDLGNBQUosR0FBc0IsSUFBdEI7Ozs7QUFDQSxNQUFBLEdBQUcsQ0FBQyxjQUFKLEdBQXNCLEVBQXRCOzs7O0FBQ0EsTUFBQSxHQUFHLENBQUMsUUFBSixHQUFnQixHQUFoQjs7O1dBQ0EsRztBQWZGLEdBV0EsQ0FaUSxDOzs7QUFtQlIsR0FBQTtBQUFBLElBQUEsR0FBQTtBQUFNLElBQUEsSUFBQSxHQUFOO0FBQUEsTUFBQSxNQUFBO0FBQ0EsRUFBQSxDQUFBLEdBQUksTUFBTSxDQUFDLEdBQVAsQ0FBVyxZQUFYLENBQXdCLEdBQXhCLEVBQTZCLE1BQTdCLENBQW9DLEtBQXhDO0FBQ0EsRUFBQSxDQUFBLEdBQU8sOEJBQUgsQ0FBRyxJQUFILENBQUcsR0FBdUIsRUFBOUI7QUFDQSxFQUFBLElBQUEsR0FBTyx5QkFBSyxDQUFDLENBQUQsSUFBQSxJQUFMLEVBQUEsRUFBQSxJQUFBLENBQVA7QUFDQSxFQUFBLE1BQUEsR0FBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLENBQUEsTUFBQSxLQUFBLElBQUEsR0FBQSxHQUFBLEdBdEJBLEVBc0JBLENBdkJRLEM7O0FBMEJSLEVBQUEsUUFBQSxHQUFXLE1BQU0sQ0FBTixRQUFBLEdBQUEsR0FBQSxHQUF3QixNQUFNLENBQUMsR0FBUCxDQUFXLE1BQTlDO0FBQ0EsRUFBQSxNQUFBLEdBQVMsMkJBQUEsTUFBQSxFQUFjO0FBQ3JCLElBQUEsR0FBQSxFQUFLLEVBQUUsTUFBTSxNQUFBLENBQU8sTUFBTSxDQURMLElBQ1IsQ0FBUixDQURnQjtBQUVyQixJQUFBLGFBQUEsRUFBZSxNQUFNLENBQU4sSUFBQSxHQUZNLE1BQUE7QUFBQSxJQUFBLFFBQUE7QUFJckIsSUFBQSxTQUFBLEVBQVcsR0FBRyxNQUFNLENBQVQsSUFKVSxtQkFBQTtBQUtyQixJQUFBLE9BQUEsRUFBQSxDQUFBLElBQUEsR0FBQSxNQUFBLENBQUEsT0FBQSxLQUFBLElBQUEsR0FBQSxJQUFBLEdBTHFCLEVBQUE7QUFNckIsSUFBQSxXQUFBLEVBQWEsTUFBTSxNQUFBLENBTkUsUUFNRixDQU5FO0FBT3JCLElBQUEsVUFBQSxFQUFZLGlCQUFpQixNQUFNLENBQU4sVUFBQSxJQVBSLEdBT1QsQ0FQUztBQVFyQixJQUFBLFVBQUEsRUFBWSxJQUFBLENBUlMsUUFRVCxDQVJTO0FBU3JCLElBQUEsU0FBQSxFQUFXLEdBQUcsTUFBTSxDQUFULElBVFUsU0FBQTtBQVVyQixJQUFBLEdBQUEsRUFBSyxXQUFBLENBQVksTUFBTSxDQVZGLEdBVWhCLENBVmdCO0FBV3JCLElBQUEsWUFBQSxFQUFjLE1BQU0sQ0FYQyxZQUFBO0FBWXJCLElBQUE7QUFacUIsR0FBZCxDQUFUO1NBZ0JBOztBQUFBLElBQUEsTUFBQTtBQUVFLElBQUEsSUFBQSxFQUFNLEdBQUcsTUFBTSxDQUFDLG9CQUFQLENBQUgsUUFGUixRQUFBO0FBR0UsSUFBQSxTQUFBLEVBQVcsTUFBTSxDQUFDLG9CQUFQLENBQTRCO0FBSHpDLEc7QUEzQ1EsQ0FBVjs7ZUFrRGUsTyIsInNvdXJjZXNDb250ZW50IjpbIiMgUGFuZGEgU2t5IE1peGluOiBNZWRpYVxuIyBUaGlzIG1peGluIGFsbG9jYXRlcyBhIHZhcmlldHkgb2YgQVdTIHJlc291cmNlcyB0byBzZXR1cCBhIG1lZGlhIHNlcnZlciBmb3IgeW91ciBhcHAuICBUaGF0IGluY2x1ZGVzIGFuIFMzIGJ1Y2tldCB0aGF0IGNhbiBhY2NlcHQgbXVsdGlwYXJ0IHVwbG9hZHMgKHZpYSBzaWduZWQgVVJMcykgYW5kIHB1YmxpYyByZWFkcy4gIFRoZXJlIGlzIGFsc28gYW4gZWRnZS1jYWNoZWQgQ0ROIHRvIGdldCB0aGF0IGFsbCB0byB0aGUgZWRnZS5cblxuaW1wb3J0IHtjYXQsIGlzT2JqZWN0LCBwbGFpblRleHQsIGNhbWVsQ2FzZSwgY2FwaXRhbGl6ZSwgbWVyZ2V9IGZyb20gXCJwYW5kYS1wYXJjaG1lbnRcIlxuaW1wb3J0IFN1bmRvZyBmcm9tIFwic3VuZG9nXCJcbmltcG9ydCBTMyBmcm9tIFwiLi9idWNrZXQtc2NhblwiXG5pbXBvcnQgYWRkUmVzb3VyY2VzIGZyb20gXCIuL2J1Y2tldC1yZXNvdXJjZXNcIlxuXG5wcm9jZXNzID0gKFNESywgY29uZmlnKSAtPlxuICB7QVdTOiB7QUNNLCBVUkw6e3Jvb3R9fX0gPSBTdW5kb2cgU0RLXG4gIHtmZXRjaH0gPSBBQ00gcmVnaW9uOiBcInVzLWVhc3QtMVwiICMgd2UgYWx3YXlzIHN0b3JlIGNlcnRzIGhlcmVcbiAge2V4aXN0c30gPSBhd2FpdCBTMyBTREssIGNvbmZpZ1xuICBhd2FpdCBhZGRSZXNvdXJjZXMgU0RLLCBjb25maWdcblxuICBfZmV0Y2ggPSAobmFtZSkgLT5cbiAgICBpZiBjZXJ0ID0gYXdhaXQgZmV0Y2ggbmFtZVxuICAgICAgY2VydFxuICAgIGVsc2VcbiAgICAgIHRocm93IG5ldyBFcnJvciBcIlVuYWJsZSB0byBsb2NhdGUgd2lsZGNhcmQgY2VydCBmb3IgI3tuYW1lfVwiXG5cbiAgd2FmRGVmYXVsdHMgPSAob3V0PXt9KSAtPlxuICAgIG91dC5mbG9vZFRocmVzaG9sZCA/PSAyMDAwXG4gICAgb3V0LmVycm9yVGhyZXNob2xkID89IDUwXG4gICAgb3V0LmJsb2NrVFRMID89IDI0MFxuICAgIG91dFxuXG4gICMgU3RhcnQgYnkgZXh0cmFjdGluZyBvdXQgdGhlIE1lZGlhIE1peGluIGNvbmZpZ3VyYXRpb246XG4gIHtlbnYsIHRhZ3M9W119ID0gY29uZmlnXG4gIGMgPSBjb25maWcuYXdzLmVudmlyb25tZW50c1tlbnZdLm1peGlucy5tZWRpYVxuICBjID0gaWYgaXNPYmplY3QgYyB0aGVuIGMgZWxzZSB7fVxuICB0YWdzID0gY2F0IChjLnRhZ3MgfHwgW10pLCB0YWdzXG4gIGJ1Y2tldCA9IGMuYnVja2V0ID8ge31cblxuICAjIEV4cGFuZCB0aGUgY29uZmlndXJhdGlvbiBmb3Igd2hvbGUgQ0ROIHN0YWNrLlxuICBob3N0bmFtZSA9IGJ1Y2tldC5ob3N0bmFtZSArIFwiLlwiICsgY29uZmlnLmF3cy5kb21haW5cbiAgYnVja2V0ID0gbWVyZ2UgYnVja2V0LCB7XG4gICAgbmV3OiAhKGF3YWl0IGV4aXN0cyBidWNrZXQubmFtZSlcbiAgICBwcmVwcm9jZXNzaW5nOiBidWNrZXQubmFtZSArIFwiLXByZVwiXG4gICAgaG9zdG5hbWUsXG4gICAgYnVja2V0VVJMOiBcIiN7YnVja2V0Lm5hbWV9LnMzLmFtYXpvbmF3cy5jb21cIlxuICAgIGV4cGlyZXM6IGJ1Y2tldC5leHBpcmVzID8gNjBcbiAgICBjZXJ0aWZpY2F0ZTogYXdhaXQgX2ZldGNoIGhvc3RuYW1lXG4gICAgcHJpY2VDbGFzczogXCJQcmljZUNsYXNzX1wiICsgKGJ1Y2tldC5wcmljZUNsYXNzIHx8IDEwMClcbiAgICBob3N0ZWR6b25lOiByb290IGhvc3RuYW1lXG4gICAgbG9nQnVja2V0OiBcIiN7YnVja2V0Lm5hbWV9LWNmbG9nc1wiXG4gICAgd2FmOiB3YWZEZWZhdWx0cyBidWNrZXQud2FmXG4gICAgb3B0aW1pemF0aW9uOiBidWNrZXQub3B0aW1pemF0aW9uXG4gICAgdGFnc1xuICB9XG5cbiAgIyBPdXRwdXQgY29uZmlndXJhdGlvbiB0byBiZSB1c2VkIGJ5IHRoZSBNZWRpYSB0ZW1wbGF0ZS5cbiAge1xuICAgIGJ1Y2tldFxuICAgIG5hbWU6IFwiI3tjb25maWcuZW52aXJvbm1lbnRWYXJpYWJsZXMuZnVsbE5hbWV9LW1lZGlhXCJcbiAgICBza3lCdWNrZXQ6IGNvbmZpZy5lbnZpcm9ubWVudFZhcmlhYmxlcy5za3lCdWNrZXRcbiAgfVxuXG5cbmV4cG9ydCBkZWZhdWx0IHByb2Nlc3NcbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=preprocessor/index.coffee