'use strict';

if (!global.Promise) {
  throw new Error('abstract-fs requires native promises');
}

module.exports = {
  System: require('./System/index.js'),
  Memory: require('./Memory/index.js')
};
