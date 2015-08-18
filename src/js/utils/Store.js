var _ = require("underscore");
var EventEmitter = require("events").EventEmitter;

function mixInto(target, source) {
  Object.keys(source).forEach(function (key) {
    // Pass if property is already defined
    if (target[key] != null) {
      return;
    }

    var toCopy = source[key];
    if (_.isFunction(toCopy)) {
      // Bind the function from the source to target and assign it to the target
      target[key] = toCopy.bind(target);
    } else {
      // Clone any objects, arrays or properties
      target[key] = _.clone(toCopy);
    }
  });
}

const Store = {
  createStore: function (store = {}) {
    var mixins = store.mixins || [];
    mixins = mixins.map(function (mixin) {
      mixInto(store, mixin);
    });

    return _.extend({}, EventEmitter.prototype, store);
  }
};

module.exports = Store;
