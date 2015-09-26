'use strict';

module.exports = function(arr, filterFn) {
  return Promise.all(arr.map(function(el) {
    return Promise.resolve(el).then(function(elVal) {
      return Promise.all([filterFn(elVal), elVal]);
    });
  })).then(function(pairs) {
    return pairs.filter(function(pair) {
      return pair[0];
    }).map(function(pair) {
      return pair[1];
    });
  });
};
