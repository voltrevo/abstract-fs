'use strict';

module.exports = function(short, long) {
  return (long.substring(0, short.length) === short);
};
