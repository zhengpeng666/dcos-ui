var _ = require("underscore");
var EventEmitter = require("events").EventEmitter;

var AppDispatcher = require("../events/AppDispatcher");
var ActionTypes = require("../constants/ActionTypes");
var EventTypes = require("../constants/EventTypes");

var _isOpen = false;

var IntercomStore = _.extend({}, EventEmitter.prototype, {

  init: function () {
    // make sure to hide Intercom on load
    var intercom = global.Intercom;
    if (intercom != null) {
      this._close();

      // register events
      intercom("onHide", function() {
        _isOpen = false;
        this.emitChange(EventTypes.INTERCOM_CHANGE);
      }.bind(this));
      intercom("onShow", function() {
        _isOpen = true;
        this.emitChange(EventTypes.INTERCOM_CHANGE);
      }.bind(this));
    }
  },

  isOpen: function () {
    return _isOpen;
  },

  _close: function () {
    var intercom = global.Intercom;
    if (intercom != null) {
      intercom("hide");
    }
  },

  _open: function () {
    var intercom = global.Intercom;
    if (intercom != null) {
      intercom("show");
    }
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
        IntercomStore._close();
        break;
      case ActionTypes.REQUEST_INTERCOM_OPEN:
        IntercomStore._open();
        break;
    }

    return true;
  })

});

module.exports = IntercomStore;
