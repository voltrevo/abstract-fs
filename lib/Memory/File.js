'use strict';

module.exports = function(ufs, ufsPath) {
  var file = {};

  file.write = function(buffer) {
    if (!(buffer instanceof Buffer)) {
      throw new Error('file.write argument must be a Buffer');
    }

    return ufs.writeFile(ufsPath, buffer);
  };

  file.read = function() {
    return ufs.readFile(ufsPath);
  };

  file.exists = function() {
    return ufs.existsFile(ufsPath);
  };

  file.delete = function() {
    return ufs.deleteFile(ufsPath);
  };

  return file;
};
