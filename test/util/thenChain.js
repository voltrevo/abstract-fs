'use strict';

module.exports = function(firstPromise, thenFunctions) {
  return thenFunctions.reduce(
    function(currPromise, thenFunction) {
      return currPromise.then(thenFunction);
    },
    firstPromise
  );
};
