'use strict';

/* global describe it beforeEach afterEach */

// core modules
var assert = require('assert');
var path = require('path');

// local modules
var abstractFs = require('../lib/index.js'); // TODO: require System only
var describeDir = require('./describers/dir.js');
var describeFile = require('./describers/file.js');
var TestDirPath = require('./util/TestDirPath.js');

// transformed modules
var fs = require('thenify-all')(
  require('fs'),
  {},
  ['lstat', 'readFile', 'mkdir']
);

describe('System', function() {
  describe('Dir', function() {
    var testDirPath = undefined;
    var dir = undefined;

    beforeEach(function() {
      return TestDirPath().then(function(tdp) {
        testDirPath = tdp;
        dir = abstractFs.System.Dir(testDirPath);
      });
    });

    afterEach(function() {
      testDirPath = undefined;
      dir = undefined;
    });

    it('can write a file to a directory', function() {
      return dir.File('foo').write(new Buffer('bar')).then(function() {
        return fs.readFile(path.join(testDirPath, 'foo'));
      }).then(function(fooBuf) {
        assert(fooBuf.toString() === 'bar');
      });
    });

    // TODO: removal of empty directories when a file is removed

    describe('contents', function() {
      // TODO: root is empty (should go in describers/dir.js?)

      describe('directories only included when non-empty', function() {
        beforeEach(function() {
          return fs.mkdir(testDirPath);
        });

        it('single empty directory not included', function() {
          return fs.mkdir(path.join(testDirPath, 'foo')).then(
            dir.contents
          ).then(function(contents) {
            assert.deepEqual(contents, {
              dirs: [],
              files: []
            });
          });
        });

        it('directory with empty directory not included', function() {
          return fs.mkdir(path.join(testDirPath, 'foo')).then(function() {
            return fs.mkdir(path.join(testDirPath, 'foo', 'bar'));
          }).then(
            dir.contents
          ).then(function(contents) {
            assert.deepEqual(contents, {
              dirs: [],
              files: []
            });
          });
        });

        it('directory with file included', function() {
          return fs.mkdir(path.join(testDirPath, 'foo')).then(function() {
            return fs.writeFile(path.join(testDirPath, 'foo', 'bar'), new Buffer(''));
          }).then(
            dir.contents
          ).then(function(contents) {
            assert.deepEqual(contents, {
              dirs: ['foo'],
              files: []
            });
          });
        });

        it('directory with directory with file included', function() {
          return fs.mkdir(path.join(testDirPath, 'foo')).then(function() {
            return fs.mkdir(path.join(testDirPath, 'foo', 'bar')).then(function() {
              return fs.writeFile(path.join(testDirPath, 'foo', 'bar', 'baz'), new Buffer(''));
            });
          }).then(
            dir.contents
          ).then(function(contents) {
            assert.deepEqual(contents, {
              dirs: ['foo'],
              files: []
            });
          });
        });
      });
    });

    describeDir(
      function() {
        return TestDirPath().then(abstractFs.System.Dir);
      },
      2
    );
  });

  describe('File', function() {
    describeFile('direct-file', function() {
      return TestDirPath().then(function(testDirPath) {
        return abstractFs.System.File(path.join(testDirPath, 'direct-file'));
      });
    });
  });
});
