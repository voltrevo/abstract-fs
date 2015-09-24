'use strict';

/* global describe it */

var assert = require('assert');
var abstractFs = require('../lib');

describe('abstract-fs', function() {
  it('can write a file to a directory', function() {
    return abstractFs.System('/tmp').Dir(uuid()).create().then(function(dir) {
      return dir.File('foo').write(Buffer('bar'));
    }).then(function() {
      // TODO: assert foo created with content 'bar'
    });
  });
});
