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

    return {
      width: width,
      height: height
    };
  },

  getPageHeight: function () {
    var body = document.body;
    var html = document.documentElement;

    var height = Math.max(body.scrollHeight, body.offsetHeight,
                          html.clientHeight, html.scrollHeight, html.offsetHeight);

    return height;
  },

  whichTransitionEvent: function (el) {
    var transitions = {
      "transition": "transitionend",
      "OTransition": "oTransitionEnd",
      "MozTransition": "transitionend",
      "WebkitTransition": "webkitTransitionEnd"
    };

    for (var t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }
  }
};

module.exports = DOMUtils;
