/*
 * From: https://raw.githubusercontent.com/angus-c/es6-react-mixins/master/src/mixin.js
 * Based on: https://gist.github.com/sebmarkbage/fac0830dbb13ccbff596
 * by Sebastian Markbåge
 *
 * This is not the original file, and has been modified
 */

import React from "react";

function noop() {
  return null;
}
function trueNoop() {
  return true;
}

function es6ify(mixin) {
  if (typeof mixin === "function") {
    // mixin is already es6 style
    return mixin;
  }

  return function (Base) {
    // mixin is old-react style plain object
    // convert to ES6 class
    class MixinClass extends Base {}

    const clonedMixin = Object.assign({}, mixin);
    // These React properties are defined as ES7 class static properties
    let staticProps = [
      "childContextTypes", "contextTypes",
      "defaultProps", "propTypes"
    ];
    staticProps.forEach(function (static) {
      MixinClass[static] = clonedMixin[static];
      delete clonedMixin[static];
    });

    Object.assign(MixinClass.prototype, clonedMixin);

    return MixinClass;
  };
}

const Util = {
  mixin: function (...mixins) {
    // Creates base class
    class Base extends React.Component {}

    Base.prototype.shouldComponentUpdate = trueNoop;

    // No-ops so we need not check before calling super()
    let functions = [
      "componentWillMount", "componentDidMount",
      "componentWillReceiveProps", "componentWillUpdate", "componentDidUpdate",
      "componentWillUnmount", "render"
    ];
    functions.forEach(function (lifecycleFn) {
      Base.prototype[lifecycleFn] = noop
    });

    mixins.reverse();

    mixins.forEach(function (mixin) {
      Base = es6ify(mixin)(Base)
    });

    return Base;
  }
};

export default Util;
