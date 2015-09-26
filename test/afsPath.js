'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// community modules
var noThrow = require('no-throw');

// local modules
var afsPath = require('../lib/afsPath.js');

var validPaths = [
  'foo',
  'foo/bar',
  'a/b/c/d'
];

var invalidPaths = [
  '.',
  '..',
  '/',
  '/foo',
  'foo/',
  'foo//bar'
];

describe('afsPath', function() {
  describe('check', function() {
    it('true for valid paths', function() {
      validPaths.forEach(function(vpath) {
        assert(afsPath.check(vpath) === true);
      });
    });

    it('false for invalid paths', function() {
      invalidPaths.forEach(function(invpath) {
        assert(afsPath.check(invpath) === false);
      });
    });
  });

  describe('validate', function() {
    it('doesn\'t throw for valid paths', function() {
      assert(noThrow(function() {
        validPaths.forEach(afsPath.validate);
        return true;
      })().value);
    });

    it('throws for invalid paths', function() {
      invalidPaths.forEach(function(invpath) {
        assert.deepEqual(
          noThrow(afsPath.validate)(invpath),
          {
            error: new Error('Invalid path: ' + invpath),
            value: undefined
          }
        );
      });
    });
  });
});
