'use strict';

// core modules
var path = require('path');

// transformed modules
var fs = require('thenify-all')(
  require('fs'),
  {},
  ['readFile', 'writeFile', 'lstat', 'unlink', 'rmdir']
);

var mkdirp = require('thenify')(require('mkdirp'));

module.exports = function(systemPath) {
  var file = {};

  file.read = function() {
    return fs.readFile(systemPath);
  };

  file.write = function(buffer) {
    if (!(buffer instanceof Buffer)) {
      throw new Error('file.write argument must be a Buffer');
    }

    return mkdirp(path.dirname(systemPath)).then(function() {
      return fs.writeFile(systemPath, buffer);
    });
  };

  file.exists = function() {
    return fs.lstat(systemPath).then(function(stats) {
      return stats.isFile();
    }).catch(function(err) {
      if (err.code === 'ENOENT') {
        return false;
      }

      throw err;
    });
  };

  file.delete = function() {
    return fs.unlink(systemPath).then(function() {
      // Also try to remove the directory, since empty directories are the same as non-existent
      // directories in abstract-fs.
      return fs.rmdir(path.dirname(systemPath)).catch(function(err) {
        // Expect an error here if the directory is not empty, which is ok. Otherwise re-throw the
        // error.
        if (err.code !== 'ENOTEMPTY') {
          throw err;
        }
      });
    });
  };

  return file;
};
