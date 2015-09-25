'use strict';

var path = require('path');

var File = require('./File.js');
var validatePath = require('../afsPath').validate;

var join = function(systemPath, afsPath) {
  validatePath(afsPath);

  var pieces = afsPath.split('/');
  pieces.unshift(systemPath);

  return path.join(pieces);
};

var Dir = function(systemPath) {
  var dir = {};

  dir.Dir = function(dpath) {
    return Dir(join(systemPath, dpath));
  };

  dir.File = function(fpath) {
    return File(join(systemPath, fpath));
  };

  return dir;
};

module.exports = Dir;
