'use strict';

/* global describe xdescribe */

// local modules
var Memory = require('../lib/index.js').Memory;
var describeDir = require('./describers/dir.js');
var describeFile = require('./describers/file.js');

describe('Memory', function() {
  xdescribe('Dir', function() {
    describeDir(Memory.Dir, 2);
  });

  describe('File', function() {
    describeFile('direct-file', Memory.File);
  });
});
