'use strict';

// local modules
var Dir = require('./Dir.js');

var Memory = {
  Dir: require('./Dir.js'),
  File: function() {
    return Dir().File('single-isolated-file');
  }
};

module.exports = Memory;
