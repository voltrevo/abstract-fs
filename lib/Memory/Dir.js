'use strict';

// core modules
var assert = require('assert');

// local modules
var afsPath = require('../afsPath.js');
var File = require('./File.js');
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

    // TODO: Why did eslint fail to report 'File undefined' below when I forgot to require it?
    return File(ufs, join(ufsPath, fpath));
  };

  dir.contents = function() {
    return ufs.dirContents(ufsPath); // TODO: test throw when asking for contents of file
  };

  return dir;
};

module.exports = function() {
  return Dir(UnderlyingFilesystem(), 'root');
};
