const _ = require("underscore");
const EventEmitter = require("events").EventEmitter;

function mixInto(target, source) {
  Object.keys(source).forEach(function (key) {

    let toCopy = source[key];
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
    if (store.storeID == null) {
      throw "All stores must have an id!";
    }

    let mixins = store.mixins || [];
    mixins.forEach(function (mixin) {
      mixInto(store, mixin);
    });

    return _.extend({}, EventEmitter.prototype, store);
  }
};

module.exports = Store;
