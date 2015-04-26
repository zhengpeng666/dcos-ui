var _ = require("underscore");
var EventEmitter = require("events").EventEmitter;

var AppDispatcher = require("../events/AppDispatcher");
var ActionTypes = require("../constants/ActionTypes");
var EventTypes = require("../constants/EventTypes");

var _isOpen = false;

var SidebarStore = _.extend({}, EventEmitter.prototype, {

  isOpen: function () {
    return _isOpen;
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
    if (source !== ActionTypes.SIDEBAR_ACTION) {
      return false;
    }

    var action = payload.action;

    switch (action.type) {
      case ActionTypes.REQUEST_SIDEBAR_OPEN:
      case ActionTypes.REQUEST_SIDEBAR_CLOSE:
        var oldIsOpen = _isOpen;
        _isOpen = action.data;

        // only emitting on change
        if (oldIsOpen !== _isOpen) {
          SidebarStore.emitChange(EventTypes.SIDEBAR_CHANGE);
        }
        break;
      case ActionTypes.REQUEST_CLI_INSTRUCTIONS:
        SidebarStore.emitChange(EventTypes.SHOW_CLI_INSTRUCTIONS);
        break;
      case ActionTypes.REQUEST_TOUR_START:
        SidebarStore.emitChange(EventTypes.SHOW_TOUR);
        break;
    }

    return true;
  })

});

module.exports = SidebarStore;
