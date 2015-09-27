'use strict';

var path = require('path');

var Dir = require('./Dir.js');
var File = require('./File.js');

module.exports = {
  Dir: function(systemPath) {
    return Dir(path.normalize(systemPath));
  },
  File: function(systemPath) {
    return File(path.normalize(systemPath));
  }
};
