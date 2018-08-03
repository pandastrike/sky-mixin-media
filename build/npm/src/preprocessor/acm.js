"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fairmont = require("fairmont");

var _url = require("./url");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var ACM,
    liftService,
    indexOf = [].indexOf;

liftService = function (s) {
  var k, service, v;
  service = {};
  for (k in s) {
    v = s[k];
    service[k] = (0, _fairmont.isFunction)(v) ? (0, _fairmont.lift)((0, _fairmont.bind)(v, s)) : v;
  }
  return service;
};

ACM = function (AWS) {
  var acm, apex, apexGet, apexScan, containsApex, containsWild, fetch, get, hasBoth, list, match, multiScan, needsApex, scan, wild, wildGet, wildScan;
  acm = liftService(new AWS.ACM({
    region: "us-east-1"
  }));
  wild = function (name) {
    return (0, _url.regularlyQualify)("*." + (0, _url.root)(name));
  };
  apex = function (name) {
    return (0, _url.regularlyQualify)((0, _url.root)(name));
  };
  // This code was adapted from a larger chunk of Haiku.  We shouldn't ever need an apex hostname for this mixin in its current form.
  needsApex = function () {
    return false;
  };
  list = (() => {
    var _ref = _asyncToGenerator(function* (current = [], token) {
      var CertificateSummaryList, NextToken, params;
      params = {
        CertificateStatuses: ["ISSUED"]
      };
      if (token) {
        params.NextToken = token;
      }
      ({ CertificateSummaryList, NextToken } = yield acm.listCertificates(params));
      current = (0, _fairmont.cat)(current, CertificateSummaryList);
      if (NextToken) {
        return yield list(current, NextToken);
      } else {
        return current;
      }
    });

    return function list() {
      return _ref.apply(this, arguments);
    };
  })();
  // Looks through many certs looking for a given domain as the primary.
  get = function (name, list) {
    return (0, _fairmont.collect)((0, _fairmont.where)({
      DomainName: name
    }, list));
  };
  wildGet = function (name, list) {
    return get(wild(name), list);
  };
  apexGet = function (name, list) {
    return get(apex(name), list);
  };
  // Looks within an individual cert for its coverage of a given domain.
  scan = (() => {
    var _ref2 = _asyncToGenerator(function* (name, CertificateArn) {
      var Certificate, alternates;
      ({ Certificate } = yield acm.describeCertificate({ CertificateArn }));
      alternates = Certificate.SubjectAlternativeNames;
      if (indexOf.call(alternates, name) >= 0) {
        return CertificateArn;
      } else {
        return void 0;
      }
    });

    return function scan(_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  })();
  multiScan = (() => {
    var _ref3 = _asyncToGenerator(function* (name, list) {
      var arns, cert;
      arns = yield _asyncToGenerator(function* () {
        var j, len, results;
        results = [];
        for (j = 0, len = list.length; j < len; j++) {
          cert = list[j];
          results.push((yield scan(name, cert.CertificateArn)));
        }
        return results;
      })();
      return (0, _fairmont.collect)((0, _fairmont.compact)(arns));
    });

    return function multiScan(_x3, _x4) {
      return _ref3.apply(this, arguments);
    };
  })();
  wildScan = (() => {
    var _ref5 = _asyncToGenerator(function* (name, list) {
      return yield multiScan(wild(name), list);
    });

    return function wildScan(_x5, _x6) {
      return _ref5.apply(this, arguments);
    };
  })();
  apexScan = (() => {
    var _ref6 = _asyncToGenerator(function* (name, list) {
      return yield multiScan(apex(name), list);
    });

    return function apexScan(_x7, _x8) {
      return _ref6.apply(this, arguments);
    };
  })();
  containsWild = (() => {
    var _ref7 = _asyncToGenerator(function* (name, list) {
      var certs, wildArns;
      wildArns = (0, _fairmont.collect)((0, _fairmont.project)("CertificateArn", wildGet(name, list)));
      certs = apexGet(name, list);
      return (0, _fairmont.cat)(wildArns, (yield wildScan(name, certs)));
    });

    return function containsWild(_x9, _x10) {
      return _ref7.apply(this, arguments);
    };
  })();
  containsApex = (() => {
    var _ref8 = _asyncToGenerator(function* (name, list) {
      var apexArns, certs;
      apexArns = (0, _fairmont.collect)((0, _fairmont.project)("CertificateArn", apexGet(name, list)));
      certs = wildGet(name, list);
      return (0, _fairmont.cat)(apexArns, (yield apexScan(name, certs)));
    });

    return function containsApex(_x11, _x12) {
      return _ref8.apply(this, arguments);
    };
  })();
  hasBoth = (() => {
    var _ref9 = _asyncToGenerator(function* (name, list) {
      var a, i, w;
      a = yield containsApex(name, list);
      w = yield containsWild(name, list);
      i = (0, _fairmont.intersection)(a, w);
      if ((0, _fairmont.empty)(i)) {
        return false;
      } else {
        return (0, _fairmont.first)(i);
      }
    });

    return function hasBoth(_x13, _x14) {
      return _ref9.apply(this, arguments);
    };
  })();
  match = (() => {
    var _ref10 = _asyncToGenerator(function* (name, list) {
      var certs;
      if (needsApex()) {
        return yield hasBoth(name, list);
      } else {
        certs = yield containsWild(name, list);
        if ((0, _fairmont.empty)(certs)) {
          return false;
        } else {
          return (0, _fairmont.first)(certs);
        }
      }
    });

    return function match(_x15, _x16) {
      return _ref10.apply(this, arguments);
    };
  })();
  fetch = (() => {
    var _ref11 = _asyncToGenerator(function* (name) {
      var arn;
      if (arn = yield match(name, (yield list()))) {
        return arn;
      } else {
        throw new Error("Unable to find the required certs in ACM.");
      }
    });

    return function fetch(_x17) {
      return _ref11.apply(this, arguments);
    };
  })();
  return { fetch };
};

exports.default = ACM;