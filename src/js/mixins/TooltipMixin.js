var _ = require("underscore");

var Tooltip = require("../vendor/tooltip");

var TooltipMixin = {
  componentDidMount: function () {
    this.tips = {};

    this._tipAttachTips();

    var container = this.getDOMNode();
    container.addEventListener("mousemove", this._tipHandleContainerMouseMove);
  },

  componentDidUpdate: function () {
    this._tipAttachTips();
  },

  componentWillUnmount: function () {
    this._tipDestroyAllTips();
  },

  _tipHandleContainerMouseMove: function (e) {
    var el = e.target;

    if (el.dataset.behavior && el.dataset.behavior === "show-tip") {
      this.tips[el.dataset.tipID].show();
      el.addEventListener("mouseleave", this._tipHandleMouseLeave);
    }
  },

  _tipHandleMouseLeave: function (e) {
    var el = e.target;

    if (this.tips[el.dataset.tipID]) {
      this.tips[el.dataset.tipID].hide();
    }

    el.removeEventListener("mouseleave");
  },

  _tipAttachTips: function () {
    var container = this.getDOMNode();
    var selected = container.querySelectorAll("[data-behavior~=show-tip]");
    var el;
    var found = [];
    var newTips = [];

    for (var i = selected.length - 1; i >= 0; i--) {
      el = selected[i];
      if (el.dataset.tipID) {
        found.push(el.dataset.tipID);
      } else if (el.dataset.tipContent) {
        newTips.push(this._tipCreateTipForElement(el));
      }
    }

    var existingTips = Object.keys(this.tips);
    var removedTips = _.difference(existingTips, found, newTips);

    if (removedTips.length) {
      for (var j = removedTips.length - 1; j >= 0; j--) {
        this._tipDestroyTip(removedTips[j]);
      }
    }
  },

  _tipCreateTipForElement: function (el) {
    el.dataset.tipID = _.uniqueId("tooltip");
    var tip = new Tooltip(el.dataset.tipContent);
    tip.attach(el);

    this.tips[el.dataset.tipID] = tip;

    return el.dataset.tipID;
  },

  _tipDestroyTip: function (tipID) {
    this.tips[tipID].destroy();
    delete this.tips[tipID];
  },

  _tipDestroyAllTips: function () {
    var tips = Object.keys(this.tips);
    for (var i = tips.length - 1; i >= 0; i--) {
      this._tipDestroyTip(tips[i]);
    }

    this.tips = {};
  }
};

module.exports = TooltipMixin;
