'use strict';

// core modules
var path = require('path');

// local modules
var File = require('./File.js');
var promiseEverySerial = require('../util/promiseEverySerial.js');
var promiseFilter = require('../util/promiseFilter.js');
var PromiseMap = require('../util/PromiseMap.js');
var validatePath = require('../afsPath.js').validate;

// transformed modules
var fs = require('thenify-all')(
  require('fs'),
  {},
  ['readdir', 'lstat']
);

var join = function(systemPath, afsPath) {
  validatePath(afsPath);

  var pieces = afsPath.split('/');
  pieces.unshift(systemPath);

  return path.join.apply(path, pieces);
};

var readDirAndStat = function(dirSystemPath) {
  return fs.readdir(dirSystemPath).then(function(basenames) {
    return Promise.all(basenames.map(function(basename) {
      var systemPath = path.join(dirSystemPath, basename);

      return fs.lstat(systemPath).then(function(stats) {
        return {
          basename: basename,
          systemPath: systemPath,
          stats: stats
        };
      });
    }));
  }).then(function(objInfos) {
    return objInfos.sort(function(a, b) {
      var aName = a.basename;
      var bName = b.basename;

      return (aName < bName ? -1 : aName > bName ? 1 : 0);
    });
  });
};

var isFile = function(objInfo) {
  return objInfo.stats.isFile();
};

var isDirNonEmpty = function(dirInfo) {
  return readDirAndStat(dirInfo.systemPath).then(function(objInfos) {
    if (objInfos.some(function(fileInfo) {
      return fileInfo.stats.isFile();
    })) {
      return true;
    }

    return promiseEverySerial(
      objInfos.filter(function(objInfo) {
        return objInfo.stats.isDirectory();
      }),
      function(dirInfo) {
        return isDirNonEmpty(dirInfo);
      }
    );
  });
};

var isNonEmptyDir = function(objInfo) {
  if (!objInfo.stats.isDirectory()) {
    return Promise.resolve(false);
  }

  return isDirNonEmpty(objInfo);
};

var Dir = function(systemPath) {
  var dir = {};

  dir.Dir = function(dpath) {
    return Dir(join(systemPath, dpath));
  };

  dir.File = function(fpath) {
    return File(join(systemPath, fpath));
  };

  dir.contents = function() {
    return readDirAndStat(systemPath).then(function(objInfos) {
      return PromiseMap({
        dirs: promiseFilter(objInfos, isNonEmptyDir),
        files: promiseFilter(objInfos, isFile)
      });
    }).then(function(dirsAndFiles) {
      return {
        dirs: dirsAndFiles.dirs.map(function(dirInfo) {
          return dirInfo.basename;
        }),
        files: dirsAndFiles.files.map(function(fileInfo) {
          return fileInfo.basename;
        })
      };
    });
  };

  return dir;
};

module.exports = Dir;
