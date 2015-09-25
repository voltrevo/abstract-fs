'use strict';

// core modules
var path = require('path');

// transformed modules
var tmp = require('thenify-all')(
  require('tmp'),
  {},
  ['dir']
);

var tmpDirPath = tmp.dir({
  unsafeCleanup: true
}).then(function(res) {
  return res[0];
});

var counter = 0;

module.exports = function() {
  return tmpDirPath.then(function(tdp) {
    return path.join(tdp, 'testDir' + counter++);
  });
};
