'use strict';

// The Memory implementation of abstract-fs has artificial delays so that it behaves the same way as
// other implementations that require asynchrony. This is how those artificial delays are done.

// TODO: test that when a Memory filesystem is mutated, the mutation never happens synchronously.

module.exports = function() {
  return new Promise(function(resolve) {
    setTimeout(resolve);
  });
};
