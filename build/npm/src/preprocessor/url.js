"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.root = exports.regularlyQualify = exports.fullyQualify = undefined;

var _fairmont = require("fairmont");

// Helper functions to assist with url manipulation for AWS calls.
var fullyQualify,
    regularlyQualify,
    root,
    indexOf = [].indexOf;

// Enforces "fully qualified" form of hostnames and domains.  Idompotent.
exports.fullyQualify = fullyQualify = function (name) {
  if ((0, _fairmont.last)(name) === ".") {
    return name;
  } else {
    return name + ".";
  }
};

// Named somewhat sarcastically.  Enforces "regular" form of hostnames
// and domains that is more expected when navigating.  Idompotnent.
exports.regularlyQualify = regularlyQualify = function (name) {
  if ((0, _fairmont.last)(name) === ".") {
    return name.slice(0, -1);
  } else {
    return name;
  }
};

// Given an arbitrary URL, return the fully qualified root domain.
// https://awesome.example.com/test/42#?=What+is+the+answer  =>  example.com.
exports.root = root = function (url) {
  var domain, e, terms;
  try {
    // Remove protocol (http, ftp, etc.), if present, and get domain
    domain = url.split('/');
    domain = indexOf.call(url, "://") >= 0 ? domain[2] : domain[0];
    // Remove port number, if present
    domain = domain.split(':')[0];
    // Now grab the root: the top-level-domain, plus the term to the left.
    terms = regularlyQualify(domain).split(".");
    terms = terms.slice(terms.length - 2);
    // Return the fully qualified version of the root
    return fullyQualify(terms.join("."));
  } catch (error) {
    e = error;
    console.error("Failed to parse root url", e);
    throw new Error();
  }
};

exports.fullyQualify = fullyQualify;
exports.regularlyQualify = regularlyQualify;
exports.root = root;