import React from 'react';
var _ = require('underscore');

var Tooltip = require('../vendor/tooltip');

var TooltipMixin = {
  componentDidMount: function () {
    this.tips = {};

    this.tip_attachTips();

    var container = this.getNode();

    container.addEventListener('mousemove', this.tip_handleContainerMouseMove);
  },

  componentDidUpdate: function () {
    this.tip_attachTips();
  },

  componentWillUnmount: function () {
    this.tip_destroyAllTips();
  },

  getNode: function () {
    return React.findDOMNode(this);
  },

  tip_handleContainerMouseMove: function (e) {
    var el = e.target;

    if (el.dataset && el.dataset.behavior && el.dataset.behavior === 'show-tip') {
      this.tip_showTip(el);
      el.addEventListener('mouseleave', this.tip_handleMouseLeave);
    }
  },

  tip_handleMouseLeave: function (e) {
    var el = e.target;
    this.tip_hideTip(el);
  },

  tip_attachTips: function () {
    var container = this.getNode();
    var selected = container.querySelectorAll('[data-behavior~=show-tip]');
    var el;
    var found = [];
    var newTips = [];

    for (var i = selected.length - 1; i >= 0; i--) {
      el = selected[i];
      if (el.dataset) {
        if (el.dataset.tipID) {
          found.push(el.dataset.tipID);
        } else if (el.dataset.tipContent) {
          newTips.push(this.tip_createTipForElement(el));
        }
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
    if (el.dataset) {
      el.dataset.tipID = _.uniqueId('tooltip');
      var options = {};
      if (el.dataset.tipPlace) {
        options.place = el.dataset.tipPlace;
      }

      var tip = new Tooltip(undefined, options);
      tip.attach(el);

      this.tips[el.dataset.tipID] = tip;

      return el.dataset.tipID;
    }
  },

  /******************/
  /*   PUBLIC API   */
  /******************/

  tip_showTip: function (el) {
    this.tip_updateTipContent(el);

    var tip = this.tips[el.dataset.tipID];
    if (!tip) {
      return;
    }

    tip.show();
  },

  tip_hideTip: function (el) {
    if (el.dataset && this.tips[el.dataset.tipID]) {
      this.tips[el.dataset.tipID].hide();
    }

    el.removeEventListener('mouseleave', this.tip_handleMouseLeave);
  },

  tip_updateTipContent: function (el, content) {
    var tip = this.tips[el.dataset.tipID];
    if (!tip) {
      return;
    }

    tip.content(content || el.dataset.tipContent);
  },

  tip_destroyTip: function (tipID) {
    // Allows us to create a new tip for the element.
    // Useful when the element has tooltip -> doesn't -> then has it again.
    var el = this.getNode().querySelector(`[data-tip-i-d="${tipID}"]`);
    if (el && el.dataset) {
      delete el.dataset.tipID;
    }

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
