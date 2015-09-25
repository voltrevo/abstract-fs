'use strict';

/* global describe it */

var assert = require('assert');

var afsPath = require('../lib/afsPath.js');

describe('afsPath', function() {
  it('foo is valid', function() {
    assert(afsPath.check('foo'));
  });

  it('foo/bar is valid', function() {
    assert(afsPath.check('foo/bar'));
  });

  it('/foo is invalid', function() {
    assert(!afsPath.check('/foo'));
  });

  it('foo/ is invalid', function() {
    assert(!afsPath.check('foo/'));
  });
});
