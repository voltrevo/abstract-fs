'use strict';

/* global describe it */

var assert = require('assert');

var afsPath = require('../lib/afsPath.js');

describe('afsPath', function() {
  it('foo is valid', function() {
    assert(afsPath.check('foo'));
  });
});
