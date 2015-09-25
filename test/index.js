'use strict';

/* global describe it */

// core modules
var assert = require('assert');
var path = require('path');

// community modules
var tmp = require('tmp');

// local modules
var abstractFs = require('../lib');

// transformed modules
var fs = require('thenify-all')(
  require('fs'),
  {},
  ['lstat']
);

var tmpDirPath = tmp.dirSync({
  unsafeCleanup: true
}).name;

var nextDir = (function() {
  var counter = 0;

  return function() {
    return path.join(tmpDirPath, 'testDir' + counter++);
  };
})();

describe('abstract-fs', function() {
  it('can create a directory', function() {
    var dirPath = nextDir();

    return abstractFs.System(dirPath).create().then(function() {
      return fs.lstat(dirPath);
    }).then(function(stats) {
      assert(stats.isDirectory());
    });
  });

  /*
  it('can write a file to a directory', function() {
    return abstractFs.System(nextDir()).then(function(dir) {
      return dir.File('foo').write(new Buffer('bar'));
    }).then(function() {
      // TODO: assert foo created with content 'bar'
    });
  });
  */
});
