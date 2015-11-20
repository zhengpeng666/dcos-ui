/*
 * From: https://raw.githubusercontent.com/angus-c/es6-react-mixins/master/src/mixin.js
 * Based on: https://gist.github.com/sebmarkbage/fac0830dbb13ccbff596
 * by Sebastian Markbåge
 *
 * This is not the original file, and has been modified
 */

import _ from "underscore";
import React from "react";

function noop() {
  return null;
}
function trueNoop() {
  return true;
}

/**
 * Modifies an object by adding missing lifecycle function
 *
 * @param  {Object} proto
 * @param  {Boolean} useNoop Optional. To use noop or call parent function
 */
function addMissingLifecycleFunctions(proto, useNoop) {
  function callToParent(lifecycleFn) {
    return function () {
      this.parent[lifecycleFn]();
    };
  }

  // No-ops so we need not check before calling super()
  let functions = {
    componentWillMount: callToParent,
    componentDidMount: callToParent,
    componentWillReceiveProps: function () {
      return function (nextProps) {
        this.parent.componentWillReceiveProps(nextProps);
      };
    },
    componentWillUpdate: function () {
      return function (nextProps, nextState) {
        this.parent.componentWillUpdate(nextProps, nextState);
      };
    },
    componentDidUpdate: function () {
      return function (prevProps, prevState) {
        this.parent.componentDidUpdate(prevProps, prevState);
      };
    },
    componentWillUnmount: callToParent
  };

  Object.keys(functions).forEach(function (lifecycleFn) {
    if (typeof proto[lifecycleFn] !== "function") {
      if (useNoop) {
        proto[lifecycleFn] = noop;
      } else {
        proto[lifecycleFn] = functions[lifecycleFn](lifecycleFn);
      }
    }
  });
}

function es6ify(mixin, Base) {
  // mixin is old-react style plain object
  // convert to ES6 class
  class MixinClass extends Base {}

  const clonedMixin = _.extend({}, mixin);

  addMissingLifecycleFunctions(mixin);

  // These React properties are defined as ES7 class static properties
  let staticProps = [
    "childContextTypes", "contextTypes",
    "defaultProps", "propTypes"
  ];
  staticProps.forEach(function (staticProp) {
    MixinClass[staticProp] = clonedMixin[staticProp];
    delete clonedMixin[staticProp];
  });

  _.extend(MixinClass.prototype, clonedMixin);

  return MixinClass;
}

const Util = {
  mixin: function (...mixins) {
    // Creates base class
    class Base extends React.Component {}

    addMissingLifecycleFunctions(Base.prototype, noop);
    Base.prototype.shouldComponentUpdate = trueNoop;

    mixins.forEach(function (mixin, i) {
      mixin.parent = mixins[i + 1] || Base.prototype;
    });

    mixins.reverse();

    mixins.forEach(function (mixin) {
      Base = es6ify(mixin, Base);
    });

    return Base;
  },

  /**
   * @param  {Object} arg to determine whether is an array or not
   * @return {Boolean} returns whether given arg is an array or not
   */
  isArray: function (arg) {
    return Object.prototype.toString.call(arg) === "[object Array]";
  }
};

export default Util;
