'use strict';

// core modules
var assert = require('assert');

// local modules
var afsPath = require('../afsPath.js');
var UnderlyingFilesystem = require('./UnderlyingFilesystem.js');

var join = function(ufsPath, extraPath) {
  return ufsPath + '/' + extraPath;
};

var Dir = function(ufs, ufsPath) {
  assert(ufsPath === '' || afsPath.check(ufsPath));

  var dir = {};

  dir.Dir = function(dpath) {
    afsPath.validate(dpath);
    return Dir(ufs, join(ufsPath, dpath));
  };

  dir.File = function(fpath) {
    afsPath.validate(fpath);
    return File(ufs, join(ufsPath, fpath));
  };

  // TODO: dir.contents

  return dir;
};

module.exports = function() {
  return Dir(UnderlyingFilesystem(), '');
};
