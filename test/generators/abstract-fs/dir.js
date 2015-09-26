'use strict';

/* global describe it beforeEach afterEach */

// core modules
var assert = require('assert');

// local modules
var describeFile = require('./file.js');

module.exports = function(Dir) {
  describe('implements empty dir', function() {
    var dir = undefined;

    beforeEach(function() {
      return Dir().then(function(d) {
        dir = d;
      });
    });

    afterEach(function() {
      dir = undefined;
    });

    it('doesn\'t have an exist function', function() {
      // Directories don't have 'existence' in abstract-fs. No distinction is made between an empty
      // directory and a directory that doesn't exist. This results in a simpler abstraction where
      // we only care about files.
      assert(dir.exists === undefined);
    });

    describeFile('foo', function() {
      return dir.File('foo');
    });

    describeFile('foo/bar', function() {
      return dir.File('foo/bar');
    });
  });
};
