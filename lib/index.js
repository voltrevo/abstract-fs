'use strict';

var assert = require('assert');

assert(
  global.Promise !== undefined,
  'abstract-fs requires native promises'
);

module.exports = {
  System: require('./System/index.js'),
  Memory: require('./Memory/index.js')
};
