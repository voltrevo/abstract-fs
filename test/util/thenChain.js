'use strict';

module.exports = function(first, thenFunctions) {
  return thenFunctions.reduce(
    function(currPromise, thenFunction) {
      return currPromise.then(thenFunction);
    },
    Promise.resolve(first)
  );
};
