'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var bind = require('./util/bind.js');

var _ = bind._;

describe('bind', function() {
  var digits = function(x, y, z) {
    return 100 * x + 10 * y + 1 * z;
  };

  describe('no args missing', function() {
    it('returns a function which takes no arguments', function() {
      var boundFn = bind(digits, [1, 2, 3]);
      assert(typeof boundFn === 'function');

      assert(boundFn() === 123);
    });
  });

  describe('single arg missing', function() {
    it('binds last two args', function() {
      assert(bind(digits, [_, 2, 3])(7) === 723);
    });

    it('binds outside args', function() {
      assert(bind(digits, [1, _, 3])(7) === 173);
    });

    it('binds first two args', function() {
      assert(bind(digits, [1, 2, _])(7) === 127);
    });
  });

  describe('two args missing', function() {
    it('binds first arg', function() {
      assert(bind(digits, [1, _, _])(7, 8) === 178);
    });

    it('binds second arg', function() {
      assert(bind(digits, [_, 2, _])(7, 8) === 728);
    });

    it('binds third arg', function() {
      assert(bind(digits, [_, _, 3])(7, 8) === 783);
    });
  });

  describe('three args missing', function() {
    it('calls the original function', function() {
      assert(bind(digits, [_, _, _])(7, 8, 9) === 789);
    });
  });
});
