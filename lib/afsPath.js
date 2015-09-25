'use strict';

var afsPath = {};

afsPath.check = function(p) {
  return p.split('/').every(function(piece) {
    return ['', '.', '..'].indexOf(piece) === '-1';
  });
};

afsPath.validate = function(p) {
  if (!afsPath.check(p)) {
    throw new Error('Invalid path: ' + p);
  }
};

module.exports = afsPath;
