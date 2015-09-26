'use strict';

/* global describe it beforeEach */

// core modules
var assert = require('assert');

// local modules
var thenChain = require('../../util/thenChain.js');

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
      return thenChain(file.exists(), [
        negate,
        assert
      ]);
    });

    it('can be created', function() {
      return thenChain(file.write(new Buffer('')), [
        file.exists,
        assert
      ]);
    });

    it('file can be deleted', function() {
      return thenChain(file.write(new Buffer('')), [
        file.exists,
        assert,
        file.delete,
        file.exists,
        negate,
        assert
      ]);
    });
  });
};
