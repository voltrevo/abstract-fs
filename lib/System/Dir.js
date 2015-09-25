'use strict';

// core modules
var path = require('path');

// local modules
var File = require('./File.js');
var validatePath = require('../afsPath.js').validate;

// transformed modules
var mkdirp = require('thenify')(require('mkdirp'));

var fs = require('thenify-all')(
  require('fs'),
  {},
  ['lstat']
);

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

  dir.exists = function() {
    return fs.lstat(systemPath).then(function(stats) {
      return stats.isDirectory();
    }).catch(function(err) {
      if (err.code === 'ENOENT') {
        return false;
      }

      throw err;
    });
  };

  return dir;
};

module.exports = Dir;
