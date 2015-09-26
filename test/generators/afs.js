'use strict';

/* global describe it beforeEach afterEach */

// core modules
var assert = require('assert');

// local modules
var thenChain = require('../util/thenChain.js');

var dir = undefined;

var setupDir = function(Dir) {
  return Dir().then(function(d) {
    dir = d;
  });
};

var negate = function(x) {
  assert(typeof x === 'boolean');
  return !x;
};

module.exports = function(Dir) {
  describe('implements blank abstract-fs', function() {
    beforeEach(function() {
      return setupDir(Dir);
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

    describe('file foo', function() {
      var foo = undefined;

      beforeEach(function() {
        return setupDir(Dir).then(function() {
          foo = dir.File('foo');
        });
      });

      afterEach(function() {
        dir = undefined;
        foo = undefined;
      });

      it('doesn\'t exist yet', function() {
        return thenChain(foo.exists(), [
          negate,
          assert
        ]);
      });

      it('foo can be created', function() {
        return thenChain(foo.write(new Buffer('')), [
          foo.exists,
          assert
        ]);
      });

      it('foo can be deleted', function() {
        return thenChain(foo.write(new Buffer('')), [
          foo.exists,
          assert,
          foo.delete,
          foo.exists,
          negate,
          assert
        ]);
      });
    });
  });
};
