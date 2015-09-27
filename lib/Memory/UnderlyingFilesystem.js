'use strict';

// core modules
var assert = require('assert');

// community modules
var uniq = require('uniq');

// local modules
var afsPath = require('../afsPath.js');
var delay = require('./util/delay.js');
var isPrefix = require('./util/isPrefix.js');

// TODO: The System implementation should probably be done by first implementing this api and then
// both Memory and System can construct the public api on top of this api.

module.exports = function() {
  var ufs = {};

  var files = {};

  var leafDirectories = function() {
    return uniq(
      Object.keys(files).map(afsPath.dirname).map(function(dirname) {
        return dirname;
      })
    );
  };

  var isDirConflict = function(filePath) {
    return leafDirectories().some(function(leafDir) {
      return isPrefix(filePath + '/', leafDir) || filePath === leafDir;
    });
  };

  ufs.writeFile = function(ufsPath, buffer) {
    assert(buffer instanceof Buffer);
    assert(afsPath.check(ufsPath));

    return delay().then(function() {
      if (isDirConflict(ufsPath)) {
        throw new Error('File path conflicts with a directory.');
      }

      files[ufsPath] = { value: buffer };
    });
  };

  ufs.readFile = function(ufsPath) {
    assert(afsPath.check(ufsPath));

    return delay().then(function() {
      var handle = files[ufsPath];

      if (!handle) {
        throw new Error('File does not exist.');
      }

      return handle.value;
    });
  };

  ufs.existsFile = function(ufsPath) {
    assert(afsPath.check(ufsPath));

    // TODO: If there is a directory collision, should this reject? Should the contract of exists
    // be that false means you should be able to write to that location without overwriting, with
    // the unavoidable caveat of something else being written there during asynchronous delays? Or
    // should the result be false if there is a directory in the way?

    return delay().then(function() {
      return !!files[ufsPath];
    });
  };

  ufs.deleteFile = function(ufsPath) {
    return ufs.existsFile(ufsPath).then(function(exists) {
      if (!exists) {
        throw new Error('File does not exist.');
      }

      files[ufsPath] = undefined;
    });
  };

  return ufs;
};
