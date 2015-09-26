'use strict';

module.exports = function() {
  var thenFunctions = Array.prototype.slice.apply(arguments);

  return thenFunctions.reduce(
    function(currPromise, thenFunction) {
      return currPromise.then(thenFunction);
    },
    Promise.resolve(undefined)
  );
};
