'use strict';

module.exports = function(arrParam, condition) {
  var arr = arrParam.slice();

  var loop = function() {
    if (arr.length === 0) {
      return Promise.resolve(true);
    }

    return Promise.resolve(arr.shift()).then(function(x) {
      return Promise.resolve(condition(x)).then(function(conditionPassed) {
        return (conditionPassed ? loop() : false);
      });
    });
  };

  return loop();
};
