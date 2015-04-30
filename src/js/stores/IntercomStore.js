var _ = require("underscore");
var EventEmitter = require("events").EventEmitter;

var AppDispatcher = require("../events/AppDispatcher");
var ActionTypes = require("../constants/ActionTypes");
var EventTypes = require("../constants/EventTypes");

var _isOpen = false;

var IntercomStore = _.extend({}, EventEmitter.prototype, {

  init: function () {
    var intercom = global.Intercom;
    if (intercom != null) {
      // make sure to hide Intercom on load
      intercom("hide");

      // register events
      intercom("onHide", this.handleCallback.bind(this, false));
      intercom("onShow", this.handleCallback.bind(this, true));
    }
  },

  isOpen: function () {
    return _isOpen;
  },

  handleCallback: function (value) {
    // only handle change if there is one
    if (_isOpen !== value) {
      this.handleChange(value);
    }
  },

  handleChange: function (value) {
    _isOpen = value;
    IntercomStore.emitChange(EventTypes.INTERCOM_CHANGE);
  },

  emitChange: function (eventName) {
    this.emit(eventName);
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    var source = payload.source;
    if (source !== ActionTypes.INTERCOM_ACTION) {
      return false;
    }

    var action = payload.action;

    switch (action.type) {
      case ActionTypes.REQUEST_INTERCOM_CLOSE:
      case ActionTypes.REQUEST_INTERCOM_OPEN:
        IntercomStore.handleChange(action.data);
        break;
    }

    return true;
  })

});

module.exports = IntercomStore;
