var Maths = {
  round: function (value, decimalPlaces) {
    /* jshint -W030 */
    decimalPlaces || (decimalPlaces = 0);
    /* jshint +W030 */
    var factor = Math.pow(10, decimalPlaces);
    return Math.round(value * factor) / factor;
  }
};

module.exports = Maths;
