'use strict';

// core modules
var assert = require('assert');

module.exports = function(map) {
  var keys = Object.keys(map);

  return Promise.all(keys.map(function(mapKey) {
    return map[mapKey];
  })).then(function(mapKeyResults) {
    var resolvedMap = {};

    var len = keys.length;
    assert(len === mapKeyResults.length);

    for (var i = 0; i !== len; i++) {
      resolvedMap[keys[i]] = mapKeyResults[i];
    }

    return resolvedMap;
  });
};
