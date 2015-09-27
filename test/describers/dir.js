'use strict';

/* global describe it beforeEach afterEach */

// core modules
var assert = require('assert');

// local modules
var describeFile = require('./file.js');

var describeDir = function(Dir, depth) {
  assert(typeof depth === 'number');
  assert(0 <= depth && depth <= 5);

  if (depth === 0) {
    return;
  }

  describe('implements empty dir', function() {
    var dir = undefined;

    beforeEach(function() {
      return Promise.resolve(Dir()).then(function(d) {
        dir = d;
      });
    });

    afterEach(function() {
      dir = undefined;
    });

    it('contains nothing', function() {
      return dir.contents().then(function(contents) {
        assert.deepEqual(contents, {
          dirs: [],
          files: []
        });
      });
    });

    it('doesn\'t have an exists function', function() {
      // Directories don't have 'existence' in abstract-fs. No distinction is made between an empty
      // directory and a directory that doesn't exist. This results in a simpler abstraction where
      // we only care about files.
      assert(dir.exists === undefined);
    });

    it('after creating foo and bar, deleting foo does not delete bar', function() {
      return Promise.all([
        dir.File('foo').write(new Buffer('')),
        dir.File('bar').write(new Buffer(''))
      ]).then(function() {
        return dir.File('foo').delete();
      }).then(function() {
        return dir.File('bar').exists();
      }).then(
        assert
      );
    });

    it('file.exists throws an error when the path contains a file', function() {
      var caught = false;

      return dir.File('foo').write(new Buffer('foo-content')).then(
        // Should throw an error because foo is a file not a directory.
        dir.File('foo/bar').exists
      ).catch(function() {
        caught = true; // What this error should look like in abstract-fs has not been decided.
      }).then(function() {
        assert(caught);
      });
    });

    it('can enumerate its contents', function() {
      return Promise.all([
        dir.File('foo/bar').write(new Buffer('')),
        dir.File('baz').write(new Buffer('')),
        dir.File('boom').write(new Buffer(''))
      ]).then(
        dir.contents
      ).then(function(contents) {
        assert.deepEqual(contents, {
          dirs: ['foo'],
          files: ['baz', 'boom']
        });
      });
    });

    it('writing a file where the path contains a dir throws', function() {
      var caught = false;

      return dir.File('foo/bar').write(new Buffer('')).then(function() {
        return dir.File('foo').write(new Buffer(''));
      }).catch(function() {
        caught = true;
      }).then(function() {
        assert(caught);
      });
    });

    describeFile('foo', function() {
      return dir.File('foo');
    });

    describe('foo directory', function() {
      var foodir = undefined;

      beforeEach(function() {
        foodir = dir.Dir('foo');
      });

      afterEach(function() {
        foodir = undefined;
      });

      it('sees bar created from the parent directory', function() {
        return dir.File('foo/bar').write(new Buffer('bar-content')).then(function() {
          return foodir.File('bar').read();
        }).then(function(barContent) {
          assert(barContent.toString() === 'bar-content');
        });
      });

      describeFile('foo/bar', function() {
        return dir.File('foo/bar');
      });

      describeDir(
        function() { return foodir; },
        depth - 1
      );
    });
  });
};

module.exports = describeDir;
