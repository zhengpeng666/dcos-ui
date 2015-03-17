var Maths = {
  round: function (value, decimalPlaces) {
    decimalPlaces = decimalPlaces || 0;
    var factor = Math.pow(10, decimalPlaces);
    return Math.round(value * factor) / factor;
  }
};

module.exports = Maths;
