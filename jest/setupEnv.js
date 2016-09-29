require('babel-polyfill');

// jsdom doesn't have support for localStorage at the moment
global.localStorage = require('localStorage');

// jsdom doesn't have support for requestAnimationFrame so we just make it work.
global.requestAnimationFrame = function (func) {
  var args = Array.prototype.slice.call(arguments).slice(1);
  return func.apply(this, args);
};

// Tests should just mock responses for the json API
// so let's just default to a noop
var RequestUtil = require('mesosphere-shared-reactjs').RequestUtil;
RequestUtil.json = function () {};
