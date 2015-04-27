var _ = require("underscore");
var EventEmitter = require("events").EventEmitter;

var AppDispatcher = require("../events/AppDispatcher");
var ActionTypes = require("../constants/ActionTypes");
var EventTypes = require("../constants/EventTypes");

var _isOpen = false;
var _isIntercomOpen = false;
var _versions = {};

var SidebarStore = _.extend({}, EventEmitter.prototype, {

  isOpen: function () {
    return _isOpen;
  },

  getVersions: function () {
    return _versions;
  },

  isIntercomOpen: function () {
    return _isIntercomOpen;
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
      case ActionTypes.REQUEST_SIDEBAR_CLOSE:
      case ActionTypes.REQUEST_SIDEBAR_OPEN:
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
      case ActionTypes.REQUEST_INTERCOM_CLOSE:
      case ActionTypes.REQUEST_INTERCOM_OPEN:
        _isIntercomOpen = action.data;
        SidebarStore.emitChange(EventTypes.INTERCOM_CHANGE);
        break;
      case ActionTypes.REQUEST_VERSIONS_SUCCESS:
        _versions = action.data;
        SidebarStore.emitChange(EventTypes.SHOW_VERSIONS_SUCCESS);
        break;
      case ActionTypes.REQUEST_VERSIONS_ERROR:
        SidebarStore.emitChange(EventTypes.SHOW_VERSIONS_ERROR);
        break;
    }

    return true;
  })

});

module.exports = SidebarStore;
