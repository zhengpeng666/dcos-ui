var _ = require("underscore");

var DOMUtils = {
  getComputedWidth: function (obj) {
    return DOMUtils.getComputedDimensions(obj).width;
  },
  getComputedDimensions: function (obj) {
    var compstyle;
    if (typeof window.getComputedStyle === "undefined") {
      compstyle = obj.currentStyle;
    } else {
      compstyle = window.getComputedStyle(obj);
    }

    var computeInnerBound = function (acc, key) {
      var val = parseInt(compstyle[key], 10);
      if (_.isNaN(val)) {
        return acc;
      } else {
        return acc - val;
      }
    };

    var width = _.foldl(
      ["paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"],
      computeInnerBound,
      obj.offsetWidth
    );
    var height = _.foldl(
      ["paddingTop", "paddingBottom", "borderTopWidth", "borderBottomWidth"],
      computeInnerBound,
      obj.offsetHeight
    );
    return { width: width, height: height };
  }
};

module.exports = DOMUtils;
