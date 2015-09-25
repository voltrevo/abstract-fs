'use strict';

/* global describe it beforeEach afterEach */

// core modules
var assert = require('assert');
var path = require('path');

// community modules
var thenifyAll = require('thenify-all');

// local modules
var abstractFs = require('../lib');

// transformed modules
var fs = thenifyAll(
  require('fs'),
  {},
  ['lstat']
);

var tmp = thenifyAll(
  require('tmp'),
  {},
  ['dir']
);

var tmpDirPath = tmp.dir({
  unsafeCleanup: true
}).then(function(res) {
  return res[0];
});

var nextDir = (function() {
  var counter = 0;

  return function() {
    return tmpDirPath.then(function(tdp) {
      return path.join(tdp, 'testDir' + counter++);
    });
  };
})();

describe('abstract-fs', function() {
  var dirPath = undefined;

  beforeEach(function() {
    return nextDir().then(function(nd) {
      dirPath = nd;
    });
  });

  afterEach(function() {
    dirPath = undefined;
  });

  it('can create a directory', function() {
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
