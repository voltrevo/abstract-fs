'use strict';

module.exports = function(test, mapParam) {
  var map = mapParam;

  if (typeof map !== 'function') {
    map = function() { return mapParam; };
  }

  return function(err) {
    if (!test(err)) {
      throw err;
    }

    return map(err);
  };
};
