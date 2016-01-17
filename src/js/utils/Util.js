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
  }
};

export default Util;
