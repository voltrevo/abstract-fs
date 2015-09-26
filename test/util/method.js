'use strict';

var bind = require('./bind.js');

var method = function(methodName, argPat) {
  return function(obj) {
    return bind(obj[methodName], argPat).apply(undefined, arguments);
  };
};

method._ = bind._;

module.exports = method;
