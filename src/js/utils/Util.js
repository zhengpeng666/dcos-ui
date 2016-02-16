
const Util = {
  /**
   * Returns the results of applying the iteratee to each element of the object.
   * @param  {Object} obj
   * @param  {Function} iteratee
   * @return {Object} resulting mapped object
   */
  mapObject: function (obj, iteratee) {
    var keys = Object.keys(obj),
        length = keys.length,
        results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  },
  /**
   * Finds last index where condition returns true
   * @param  {Array} array         Array to search
   * @param  {Function} condition  Condition to find
   * @return {Int}                 Index of last item or -1 if not found
   */
  findLastIndex: function (array, condition) {
    let length = array.length;
    let index = length - 1;
    for (; index >= 0; index--) {
      if (condition(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  },

  /**
   * @param  {Object} arg to determine whether is an array or not
   * @return {Boolean} returns whether given arg is an array or not
   */
  isArray: function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  },

  getLocaleCompareSortFn: function (prop) {
    return function (a, b) {
      return a[prop].localeCompare(b[prop]);
    };
  },

  /**
   * @param {Function} func A callback function to be called
   * @param {Number} wait How long to wait
   * @returns {Function} A function, that, after triggered the first time, will
   * wait for a period of time before the next trigger. If triggered during the
   * wait, the function will be invoked immediately after the wait is over.
   * This function is specifically made for React events, hence the nativeEvent
   * lookup.
   */
  throttleScroll: function (func, wait) {
    let canCall = true;
    let callWhenReady = false;

    let resetCall = function () {
      if (callWhenReady) {
        setTimeout(resetCall.bind(this, arguments[0]), wait);
        callWhenReady = false;
        func.apply(this, arguments);
      } else {
        canCall = true;
      }
    };

    return function () {
      if (canCall) {
        setTimeout(resetCall.bind(this, arguments[0].nativeEvent), wait);
        canCall = false;
        callWhenReady = false;
        func.apply(this, arguments);
      } else {
        callWhenReady = true;
      }
    };
  }
};

module.exports = Util;
