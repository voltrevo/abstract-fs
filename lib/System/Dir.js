'use strict';

// core modules
var path = require('path');

// local modules
var File = require('./File.js');
var validatePath = require('../afsPath.js').validate;

// transformed modules
var mkdirp = require('thenify')(require('mkdirp'));

var join = function(systemPath, afsPath) {
  validatePath(afsPath);

  var pieces = afsPath.split('/');
  pieces.unshift(systemPath);

  return path.join.apply(path, pieces);
};

var Dir = function(systemPath) {
  var dir = {};

  dir.Dir = function(dpath) {
    return Dir(join(systemPath, dpath));
  };

  dir.File = function(fpath) {
    return File(join(systemPath, fpath));
  };

  dir.create = function() {
    return mkdirp(systemPath);
  };

  return dir;
};

module.exports = Dir;
