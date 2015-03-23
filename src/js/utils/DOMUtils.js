var _ = require("underscore");

var DOMUtils = {
  getComputedWidth: function (obj) {
    var compstyle;
    if (typeof window.getComputedStyle === "undefined") {
      compstyle = obj.currentStyle;
    } else {
      compstyle = window.getComputedStyle(obj);
    }
    return _.foldl(
      ["paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"],
      function (acc, key) {
        var val = parseInt(compstyle[key], 10);
        if (_.isNaN(val)) {
          return acc;
        } else {
          return acc - val;
        }
      },
      obj.offsetWidth
    );
  }
};

module.exports = DOMUtils;
