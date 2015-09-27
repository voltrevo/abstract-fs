'use strict';

/* global describe it beforeEach */

// core modules
var assert = require('assert');

// community modules
var noThrow = require('no-throw');

// local modules
var bind = require('../util/bind.js');
var thenChain = require('../util/thenChain.js');

var negate = function(x) {
  assert(typeof x === 'boolean');
  return !x;
};

module.exports = function(name, File) {
  describe(name + ' implements non-existent file', function() {
    var file = undefined;

    beforeEach(function() {
      return Promise.resolve(File()).then(function(file_) {
        file = file_;
      });
    });

    it('doesn\'t exist', function() {
      return thenChain(
        file.exists,
        negate,
        assert
      );
    });

    it('reading throws because it doesn\'t exist', function() {
      var caught = false;

      return file.read().catch(function() {
        caught = true;
      }).then(function() {
        assert(caught);
      });
    });

    it('deleting throws because it doesn\'t exist', function() {
      var caught = false;

      return file.delete().catch(function() {
        caught = true;
      }).then(function() {
        assert(caught);
      });
    });

    it('can be created', function() {
      return thenChain(
        bind(file.write, [new Buffer('')]),
        file.exists,
        assert
      );
    });

    it('file can be deleted', function() {
      return thenChain(
        bind(file.write, [new Buffer('')]),
        file.exists,
        assert,
        file.delete,
        file.exists,
        negate,
        assert
      );
    });

    it('throws if you try to write a non-buffer', function() {
      assert.deepEqual(
        noThrow(file.write)('not a buffer'),
        {
          error: new Error('file.write argument must be a buffer'),
          value: undefined
        }
      );
    });
  });
};
