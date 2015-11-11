import _ from "underscore";

function addListener(hookName, listener, store) {
  let listeners = store[hookName];

  if (_.isArray(listeners)) {
    listeners.push(listener);
  } else {
    store[hookName] = [listener];
  }
}

class Plugins {
  constructor() {
    this.actions = {};

    this.filters = {
      renderingBanner: []
    };
  }

  doAction(hookName) {
    let listeners = this.actions[hookName];
    let args = Array.prototype.slice.apply(arguments, 1);

    if (_.isArray(listeners)) {
      listeners.forEach(function (listener) {
        listener.apply(this, args);
      }, this);
    }
  }

  addAction(hookName, listener) {
    addListener(hookName, listener, this.actions);
  }

  applyFilter(hookName, arg) {
    let listeners = this.filters[hookName];

    if (_.isArray(listeners)) {
      return listeners.reduce(function (total, listener) {
        return listener.call(this, total);
      }.bind(this), arg);
    }

    return null;
  }

  addFilter(hookName, listener) {
    addListener(hookName, listener, this.filters);
  }
}

export default new Plugins();
