'use strict';

/* global describe it beforeEach afterEach */

// core modules
var assert = require('assert');

module.exports = function(Dir) {
  describe('implements abstract-fs', function() {
    var dir = undefined;

    beforeEach(function() {
      return Dir().then(function(d) {
        dir = d;
      });
    });

    afterEach(function() {
      dir = undefined;
    });

    it('can be created', function() {
      return dir.create().then(function() {
        return dir.exists();
      }).then(function(exists) {
        assert(exists);
      });
    });
  });
};
