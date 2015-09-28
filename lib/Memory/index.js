'use strict';

// local modules
var AbstractFs = require('../AbstractFs/index.js');
var Ufs = require('./UnderlyingFilesystem.js');

var fs = AbstractFs(Ufs);

var Memory = {
  Dir: function() {
    return fs.Dir('root');
  },
  File: function() {
    return Memory.Dir().File('single-file');
  }
};

module.exports = Memory;
