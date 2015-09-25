'use strict';

/* global describe it beforeEach afterEach */

// core modules
var assert = require('assert');
var path = require('path');

// local modules
var abstractFs = require('../lib/index.js');
var testAfs = require('./generators/afs.js');
var TestDirPath = require('./util/TestDirPath.js');

// transformed modules
var fs = require('thenify-all')(
  require('fs'),
  {},
  ['lstat', 'readFile']
);

describe('System', function() {
  var testDirPath = undefined;
  var dir = undefined;

  beforeEach(function() {
    return TestDirPath().then(function(tdp) {
      testDirPath = tdp;
      dir = abstractFs.System(testDirPath);
    });
  });

  afterEach(function() {
    testDirPath = undefined;
    dir = undefined;
  });

  it('can create a directory', function() {
    return dir.create().then(function() {
      return fs.lstat(testDirPath);
    }).then(function(stats) {
      assert(stats.isDirectory());
    });
  });

  it('can write a file to a directory', function() {
    return dir.File('foo').write(new Buffer('bar')).then(function() {
      return fs.readFile(path.join(testDirPath, 'foo'));
    }).then(function(fooBuf) {
      assert(fooBuf.toString() === 'bar');
    });
  });

  testAfs(function() {
    return TestDirPath().then(abstractFs.System);
  });
});
