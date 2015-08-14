var _ = require("underscore");
var EventEmitter = require("events").EventEmitter;

const Stores = {
  createStore: function (store) {
    if (store.mixins == null) {
      store.mixins = [];
    }

    return _.extend({}, EventEmitter.prototype, store, ...store.mixins);
  }
};

module.exports = Stores;
