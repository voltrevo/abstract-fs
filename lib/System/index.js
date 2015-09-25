'use strict';

var path = require('path');

var Dir = require('./Dir.js');

module.exports = function(systemPath) {
  return Dir(path.normalize(systemPath));
};
