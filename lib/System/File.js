'use strict';

// core modules
var path = require('path');

// local modules
var handleError = require('../util/handleError.js');

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
    }).catch(
      handleError(
        function(err) { return err.code === 'ENOENT'; },
        false
      )
    );
  };

  file.delete = function() {
    return fs.unlink(systemPath).then(function() {
      // Also try to remove the directory, since empty directories are the same as non-existent
      // directories in abstract-fs.
      return fs.rmdir(path.dirname(systemPath)).catch(
        // Expect an error here if the directory is not empty, which is ok. Otherwise re-throw the
        // error.
        handleError(function(err) { return err.code === 'ENOTEMPTY'; })
      );
    });
  };

  return file;
};
