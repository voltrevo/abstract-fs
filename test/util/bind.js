'use strict';

var assert = require('assert');

var _ = {};

var bind = function(fn, argPattern) {
  assert(typeof fn === 'function');
  assert(Array.isArray(argPattern));

  var missingNo = argPattern.map(function(argPat) {
    return argPat === _ ? 1 : 0;
  }).reduce(function(x, y) {
    return x + y;
  });

  return function() {
    assert(arguments.length === missingNo);

    var i = 0;
    var args = arguments;

    return fn.apply(undefined, argPattern.map(function(argPat) {
      return (argPat === _ ? args[i++] : argPat);
    }));
  };
};

bind._ = _;

module.exports = bind;
