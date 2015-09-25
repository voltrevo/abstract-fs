'use strict';

// core modules
var path = require('path');

// transformed modules
var fs = require('thenify-all')(
  require('fs'),
  {},
  ['readFile', 'writeFile']
);

var mkdirp = require('thenify')(require('mkdirp'));

module.exports = function(systemPath) {
  var file = {};

  file.read = function() {
    return fs.readFile(systemPath);
  };

  file.write = function(buffer) {
    if (!buffer instanceof Buffer) {
      throw new Error('file.write argument must be a Buffer');
    }

    return mkdirp(path.dirname(systemPath)).then(function() {
      return fs.writeFile(systemPath, buffer);
    });
  };

  return file;
};
