'use strict';

module.exports = function(arrParam, condition) {
  var arr = arrParam.slice();

  var loop = function() {
    if (arr.length === 0) {
      return Promise.resolve(false);
    }

    return Promise.resolve(arr.shift()).then(function(x) {
      return Promise.resolve(condition(x)).then(function(conditionPassed) {
        return (conditionPassed ? true : loop());
      });
    });
  };

  return loop();
};
