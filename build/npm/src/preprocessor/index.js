"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pandaParchment = require("panda-parchment");

var _sundog = _interopRequireDefault(require("sundog"));

var _bucketResources = _interopRequireDefault(require("./bucket-resources"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Panda Sky Mixin: Media
// This mixin allocates a variety of AWS resources to setup a media server for your app.  That includes an S3 bucket that can accept multipart uploads (via signed URLs) and public reads.  There is also an edge-cached CDN to get that all to the edge.
var process;

process = async function (SDK, config) {
  var ACM, _fetch, bucket, c, env, fetch, hostname, ref, ref1, root, tags, wafDefaults;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9za3ktbWl4aW4tbWVkaWEvc3JjL3ByZXByb2Nlc3Nvci9pbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUdBOztBQUNBOztBQUNBOzs7O0FBTEE7O0FBQUEsSUFBQSxPQUFBOztBQU9BLE9BQUEsR0FBVSxnQkFBQSxHQUFBLEVBQUEsTUFBQSxFQUFBO0FBQ1IsTUFBQSxHQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLEtBQUEsRUFBQSxRQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLFdBQUE7O0FBQUEsR0FBQTtBQUFDLElBQUEsR0FBQSxFQUFLO0FBQUEsTUFBQSxHQUFBO0FBQU0sTUFBQSxHQUFBLEVBQUk7QUFBQSxRQUFBO0FBQUE7QUFBVjtBQUFOLE1BQTJCLHFCQUEzQixHQUEyQixDQUEzQjtBQUNBLEdBQUE7QUFBQSxJQUFBO0FBQUEsTUFBVSxHQUFBLENBQUk7QUFBQSxJQUFBLE1BQUEsRUFBQSxXQUFBLENBQUE7O0FBQUEsR0FBSixDQUFWO0FBQ0EsUUFBTSw4QkFBQSxHQUFBLEVBQUEsTUFBQSxDQUFOOztBQUVBLEVBQUEsTUFBQSxHQUFTLGdCQUFBLElBQUEsRUFBQTtBQUNQLFFBQUEsSUFBQTs7QUFBQSxRQUFHLElBQUEsR0FBTyxNQUFNLEtBQUEsQ0FBaEIsSUFBZ0IsQ0FBaEIsRUFBQTthQUFBLEk7QUFBQSxLQUFBLE1BQUE7QUFHRSxZQUFNLElBQUEsS0FBQSxDQUFVLHNDQUFBLElBSGxCLEVBR1EsQ0FBTjs7QUFKSyxHQUFUOztBQU1BLEVBQUEsV0FBQSxHQUFjLFVBQUMsR0FBQSxHQUFELEVBQUEsRUFBQTs7QUFDWixNQUFBLEdBQUcsQ0FBQyxjQUFKLEdBQXNCLElBQXRCOzs7O0FBQ0EsTUFBQSxHQUFHLENBQUMsY0FBSixHQUFzQixFQUF0Qjs7OztBQUNBLE1BQUEsR0FBRyxDQUFDLFFBQUosR0FBZ0IsR0FBaEI7OztXQUNBLEc7QUFkRixHQVVBLENBWFEsQzs7O0FBa0JSLEdBQUE7QUFBQSxJQUFBLEdBQUE7QUFBTSxJQUFBLElBQUEsR0FBTjtBQUFBLE1BQUEsTUFBQTtBQUNBLEVBQUEsQ0FBQSxHQUFJLE1BQU0sQ0FBQyxHQUFQLENBQVcsWUFBWCxDQUF3QixHQUF4QixFQUE2QixNQUE3QixDQUFvQyxLQUF4QztBQUNBLEVBQUEsQ0FBQSxHQUFPLDhCQUFILENBQUcsSUFBSCxDQUFHLEdBQXVCLEVBQTlCO0FBQ0EsRUFBQSxJQUFBLEdBQU8seUJBQUssQ0FBQyxDQUFELElBQUEsSUFBTCxFQUFBLEVBQUEsSUFBQSxDQUFQO0FBQ0EsRUFBQSxNQUFBLEdBQUEsQ0FBQSxHQUFBLEdBQUEsQ0FBQSxDQUFBLE1BQUEsS0FBQSxJQUFBLEdBQUEsR0FBQSxHQXJCQSxFQXFCQSxDQXRCUSxDOztBQXlCUixFQUFBLFFBQUEsR0FBVyxNQUFNLENBQU4sUUFBQSxHQUFBLEdBQUEsR0FBd0IsTUFBTSxDQUFDLEdBQVAsQ0FBVyxNQUE5QztBQUNBLEVBQUEsTUFBQSxHQUFTLDJCQUFBLE1BQUEsRUFBYztBQUNyQixJQUFBLGFBQUEsRUFBZSxNQUFNLENBQU4sSUFBQSxHQURNLE1BQUE7QUFBQSxJQUFBLFFBQUE7QUFHckIsSUFBQSxTQUFBLEVBQVcsR0FBRyxNQUFNLENBQVQsSUFIVSxtQkFBQTtBQUlyQixJQUFBLE9BQUEsRUFBQSxDQUFBLElBQUEsR0FBQSxNQUFBLENBQUEsT0FBQSxLQUFBLElBQUEsR0FBQSxJQUFBLEdBSnFCLEVBQUE7QUFLckIsSUFBQSxXQUFBLEVBQWEsTUFBTSxNQUFBLENBTEUsUUFLRixDQUxFO0FBTXJCLElBQUEsVUFBQSxFQUFZLGlCQUFpQixNQUFNLENBQU4sVUFBQSxJQU5SLEdBTVQsQ0FOUztBQU9yQixJQUFBLFVBQUEsRUFBWSxJQUFBLENBUFMsUUFPVCxDQVBTO0FBUXJCLElBQUEsU0FBQSxFQUFXLEdBQUcsTUFBTSxDQUFULElBUlUsU0FBQTtBQVNyQixJQUFBLEdBQUEsRUFBSyxXQUFBLENBQVksTUFBTSxDQVRGLEdBU2hCLENBVGdCO0FBVXJCLElBQUEsWUFBQSxFQUFjLE1BQU0sQ0FWQyxZQUFBO0FBV3JCLElBQUE7QUFYcUIsR0FBZCxDQUFUO1NBZUE7O0FBQUEsSUFBQSxNQUFBO0FBRUUsSUFBQSxJQUFBLEVBQU0sR0FBRyxNQUFNLENBQUMsb0JBQVAsQ0FBSCxRQUZSLFFBQUE7QUFHRSxJQUFBLFNBQUEsRUFBVyxNQUFNLENBQUMsb0JBQVAsQ0FBNEI7QUFIekMsRztBQXpDUSxDQUFWOztlQWdEZSxPIiwic291cmNlc0NvbnRlbnQiOlsiIyBQYW5kYSBTa3kgTWl4aW46IE1lZGlhXG4jIFRoaXMgbWl4aW4gYWxsb2NhdGVzIGEgdmFyaWV0eSBvZiBBV1MgcmVzb3VyY2VzIHRvIHNldHVwIGEgbWVkaWEgc2VydmVyIGZvciB5b3VyIGFwcC4gIFRoYXQgaW5jbHVkZXMgYW4gUzMgYnVja2V0IHRoYXQgY2FuIGFjY2VwdCBtdWx0aXBhcnQgdXBsb2FkcyAodmlhIHNpZ25lZCBVUkxzKSBhbmQgcHVibGljIHJlYWRzLiAgVGhlcmUgaXMgYWxzbyBhbiBlZGdlLWNhY2hlZCBDRE4gdG8gZ2V0IHRoYXQgYWxsIHRvIHRoZSBlZGdlLlxuXG5pbXBvcnQge2NhdCwgaXNPYmplY3QsIHBsYWluVGV4dCwgY2FtZWxDYXNlLCBjYXBpdGFsaXplLCBtZXJnZX0gZnJvbSBcInBhbmRhLXBhcmNobWVudFwiXG5pbXBvcnQgU3VuZG9nIGZyb20gXCJzdW5kb2dcIlxuaW1wb3J0IGFkZFJlc291cmNlcyBmcm9tIFwiLi9idWNrZXQtcmVzb3VyY2VzXCJcblxucHJvY2VzcyA9IChTREssIGNvbmZpZykgLT5cbiAge0FXUzoge0FDTSwgVVJMOntyb290fX19ID0gU3VuZG9nIFNES1xuICB7ZmV0Y2h9ID0gQUNNIHJlZ2lvbjogXCJ1cy1lYXN0LTFcIiAjIHdlIGFsd2F5cyBzdG9yZSBjZXJ0cyBoZXJlXG4gIGF3YWl0IGFkZFJlc291cmNlcyBTREssIGNvbmZpZ1xuXG4gIF9mZXRjaCA9IChuYW1lKSAtPlxuICAgIGlmIGNlcnQgPSBhd2FpdCBmZXRjaCBuYW1lXG4gICAgICBjZXJ0XG4gICAgZWxzZVxuICAgICAgdGhyb3cgbmV3IEVycm9yIFwiVW5hYmxlIHRvIGxvY2F0ZSB3aWxkY2FyZCBjZXJ0IGZvciAje25hbWV9XCJcblxuICB3YWZEZWZhdWx0cyA9IChvdXQ9e30pIC0+XG4gICAgb3V0LmZsb29kVGhyZXNob2xkID89IDIwMDBcbiAgICBvdXQuZXJyb3JUaHJlc2hvbGQgPz0gNTBcbiAgICBvdXQuYmxvY2tUVEwgPz0gMjQwXG4gICAgb3V0XG5cbiAgIyBTdGFydCBieSBleHRyYWN0aW5nIG91dCB0aGUgTWVkaWEgTWl4aW4gY29uZmlndXJhdGlvbjpcbiAge2VudiwgdGFncz1bXX0gPSBjb25maWdcbiAgYyA9IGNvbmZpZy5hd3MuZW52aXJvbm1lbnRzW2Vudl0ubWl4aW5zLm1lZGlhXG4gIGMgPSBpZiBpc09iamVjdCBjIHRoZW4gYyBlbHNlIHt9XG4gIHRhZ3MgPSBjYXQgKGMudGFncyB8fCBbXSksIHRhZ3NcbiAgYnVja2V0ID0gYy5idWNrZXQgPyB7fVxuXG4gICMgRXhwYW5kIHRoZSBjb25maWd1cmF0aW9uIGZvciB3aG9sZSBDRE4gc3RhY2suXG4gIGhvc3RuYW1lID0gYnVja2V0Lmhvc3RuYW1lICsgXCIuXCIgKyBjb25maWcuYXdzLmRvbWFpblxuICBidWNrZXQgPSBtZXJnZSBidWNrZXQsIHtcbiAgICBwcmVwcm9jZXNzaW5nOiBidWNrZXQubmFtZSArIFwiLXByZVwiXG4gICAgaG9zdG5hbWUsXG4gICAgYnVja2V0VVJMOiBcIiN7YnVja2V0Lm5hbWV9LnMzLmFtYXpvbmF3cy5jb21cIlxuICAgIGV4cGlyZXM6IGJ1Y2tldC5leHBpcmVzID8gNjBcbiAgICBjZXJ0aWZpY2F0ZTogYXdhaXQgX2ZldGNoIGhvc3RuYW1lXG4gICAgcHJpY2VDbGFzczogXCJQcmljZUNsYXNzX1wiICsgKGJ1Y2tldC5wcmljZUNsYXNzIHx8IDEwMClcbiAgICBob3N0ZWR6b25lOiByb290IGhvc3RuYW1lXG4gICAgbG9nQnVja2V0OiBcIiN7YnVja2V0Lm5hbWV9LWNmbG9nc1wiXG4gICAgd2FmOiB3YWZEZWZhdWx0cyBidWNrZXQud2FmXG4gICAgb3B0aW1pemF0aW9uOiBidWNrZXQub3B0aW1pemF0aW9uXG4gICAgdGFnc1xuICB9XG5cbiAgIyBPdXRwdXQgY29uZmlndXJhdGlvbiB0byBiZSB1c2VkIGJ5IHRoZSBNZWRpYSB0ZW1wbGF0ZS5cbiAge1xuICAgIGJ1Y2tldFxuICAgIG5hbWU6IFwiI3tjb25maWcuZW52aXJvbm1lbnRWYXJpYWJsZXMuZnVsbE5hbWV9LW1lZGlhXCJcbiAgICBza3lCdWNrZXQ6IGNvbmZpZy5lbnZpcm9ubWVudFZhcmlhYmxlcy5za3lCdWNrZXRcbiAgfVxuXG5cbmV4cG9ydCBkZWZhdWx0IHByb2Nlc3NcbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=/Users/david/repos/sky-mixin-media/src/preprocessor/index.coffee