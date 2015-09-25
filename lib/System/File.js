'use strict';

var assert = require('assert');

var fs = require('thenify-all')(
  require('fs'),
  {},
  ['readFile', 'writeFile']
);

module.exports = function(systemPath) {
  var file = {};

  file.read = function() {
    return fs.readFile(systemPath);
  };

  file.write = function(buffer) {
    assert(buffer instanceof Buffer);
    return fs.writeFile(systemPath, buffer);
  };

  return file;
};
