const Util = {
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
