var _ = require("underscore");
var EventEmitter = require("events").EventEmitter;

const Store = {
  createStore: function (store) {
    if (store.mixins == null) {
      store.mixins = [];
    }

    return _.extend({}, EventEmitter.prototype, ...store.mixins, store);
  }
};

module.exports = Store;
