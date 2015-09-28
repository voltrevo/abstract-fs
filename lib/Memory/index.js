'use strict';

// local modules
var AbstractFs = require('../AbstractFs/index.js');
var Ufs = require('./UnderlyingFilesystem.js');

var fs = AbstractFs(Ufs);

module.exports = {
  Dir: function() {
    return fs.Dir('root');
  },
  File: function() {
    return fs.File('root');
  }
};
