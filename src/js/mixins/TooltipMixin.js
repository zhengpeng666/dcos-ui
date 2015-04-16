var _ = require("underscore");

var Tooltip = require("../vendor/tooltip");

function getDataAttribute(el, key) {
  if (el.dataset === undefined) {
    return el.getAttribute("data-" + key);
  }

  return el.dataset[key];
}

function setDataAttribute(el, key, value) {
  if (el.dataset === undefined) {
    el.setAttribute("data-" + key, value);
  } else {
    el.dataset[key] = value;
  }
}

function removeDataAttribute(el, key) {
  if (el == null) {
    return;
  }

  if (el.dataset === undefined) {
    el.removeAttribute("data-" + key);
  } else {
    delete el.dataset[key];
  }
}

var TooltipMixin = {
  componentDidMount: function () {
    this.tips = {};

    this.tip_attachTips();

    var container = this.getDOMNode();
    container.addEventListener("mousemove", this.tip_handleContainerMouseMove);
  },

  componentDidUpdate: function () {
    this.tip_attachTips();
  },

  componentWillUnmount: function () {
    this.tip_destroyAllTips();
  },

  tip_handleContainerMouseMove: function (e) {
    var el = e.target;

    if (getDataAttribute(el, "behavior") && getDataAttribute(el, "behavior") === "show-tip") {
      var tip = this.tips[getDataAttribute(el, "tipID")];
      tip.content(getDataAttribute(el, "tipContent"));
      tip.show();
      el.addEventListener("mouseleave", this.tip_handleMouseLeave);
    }
  },

  tip_handleMouseLeave: function (e) {
    var el = e.target;

    if (this.tips[getDataAttribute(el, "tipID")]) {
      this.tips[getDataAttribute(el, "tipID")].hide();
    }

    el.removeEventListener("mouseleave", this.tip_handleMouseLeave);
  },

  tip_attachTips: function () {
    var container = this.getDOMNode();
    var selected = container.querySelectorAll("[data-behavior~=show-tip]");
    var el;
    var found = [];
    var newTips = [];

    for (var i = selected.length - 1; i >= 0; i--) {
      el = selected[i];
      if (getDataAttribute(el, "tipID")) {
        found.push(getDataAttribute(el, "tipID"));
      } else if (getDataAttribute(el, "tipContent")) {
        newTips.push(this.tip_createTipForElement(el));
      }
    }

    var existingTips = Object.keys(this.tips);
    var removedTips = _.difference(existingTips, found, newTips);

    if (removedTips.length) {
      for (var j = removedTips.length - 1; j >= 0; j--) {
        this.tip_destroyTip(removedTips[j]);
      }
    }
  },

  tip_createTipForElement: function (el) {
    setDataAttribute(el, "tipID", _.uniqueId("tooltip"));
    var options = {};
    if (getDataAttribute(el, "tipPlace")) {
      options.place = getDataAttribute(el, "tipPlace");
    }

    var tip = new Tooltip(undefined, options);
    tip.attach(el);

    this.tips[getDataAttribute(el, "tipID")] = tip;

    return getDataAttribute(el, "tipID");
  },

  tip_destroyTip: function (tipID) {
    // Allows us to create a new tip for the element.
    // Useful when the element has tooltip -> doesn't -> then has it again.
    var el = this.getDOMNode().querySelector("[data-tip-i-d=" + tipID + "]");

    removeDataAttribute(el, "tipID");

    this.tips[tipID].destroy();
    delete this.tips[tipID];
  },

  tip_destroyAllTips: function () {
    var tips = Object.keys(this.tips);
    for (var i = tips.length - 1; i >= 0; i--) {
      this.tip_destroyTip(tips[i]);
    }

    this.tips = {};
  }
};

module.exports = TooltipMixin;
