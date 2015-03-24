var Maths = {
  round: function (value, decimalPlaces) {
    decimalPlaces = decimalPlaces || 0;
    var factor = Math.pow(10, decimalPlaces);
    return Math.round(value * factor) / factor;
  },

  // maps to domain (0,1)
  mapValue: function (value, stats) {
    value = parseFloat(value);

    var range = stats.max - stats.min;
    var min = stats.min;

    if (range === 0) {
      return min;
    }

    var v = (value - min) / range;

    if (isNaN(v)) {
      return undefined;
    } else {
      return v;
    }
  },

  // pass in between 0 and 1
  unmapValue: function (value, stats) {
    value = stats.min + value * (stats.max - stats.min);

    if (isNaN(value)) {
      return undefined;
    } else {
      return value;
    }
  }

};

module.exports = Maths;
