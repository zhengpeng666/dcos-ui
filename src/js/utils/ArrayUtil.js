const ArrayUtil = {
  /**
   * @param  {Object} object to determine whether is an array or not
   * @return {Boolean} returns whether given object is an array or not
   */
  isArray: function (object) {
    return Object.prototype.toString.call(object) === "[object Array]";
  }
};

module.exports = ArrayUtil;
