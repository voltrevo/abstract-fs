'use strict';

var Dir = require('./Dir.js');
var File = require('./File.js');

module.exports = function(UnderlyingFilesystem) {
  return {
    Dir: function(ufsPath) { return Dir(UnderlyingFilesystem(), ufsPath); },
    File: function(ufsPath) { return File(UnderlyingFilesystem(), ufsPath); }
  };
};
