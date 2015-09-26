'use strict';

/* global describe it beforeEach afterEach */

// core modules
var assert = require('assert');

// local modules
var describeFile = require('./file.js');

var describeDir = function(Dir, depth) {
  assert(typeof depth === 'number');
  assert(0 <= depth && depth <= 5);

  if (depth === 0) {
    return;
  }

  describe('implements empty dir', function() {
    var dir = undefined;

    beforeEach(function() {
      return Promise.resolve(Dir()).then(function(d) {
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

    describe('foo directory', function() {
      var foodir = undefined;

      beforeEach(function() {
        foodir = dir.Dir('foo');
      });

      afterEach(function() {
        foodir = undefined;
      });

      it('sees bar created from the parent directory', function() {
        return dir.File('foo/bar').write(new Buffer('bar-content')).then(function() {
          return foodir.File('bar').read();
        }).then(function(barContent) {
          assert(barContent.toString() === 'bar-content');
        });
      });

      describeFile('foo/bar', function() {
        return dir.File('foo/bar');
      });

      describeDir(
        function() { return foodir; },
        depth - 1
      );
    });
  });
};

module.exports = describeDir;
