var AppDispatcher = require("../events/AppDispatcher");
var ActionTypes = require("../constants/ActionTypes");
var EventTypes = require("../constants/EventTypes");
var GetSetMixin = require("../mixins/GetSetMixin");
var Store = require("../utils/Store");

var IntercomStore = Store.createStore({

  mixins: [GetSetMixin],

  init: function () {
    this.set({isOpen: false});

    var intercom = global.Intercom;
    if (intercom != null) {
      // make sure to hide Intercom on load
      intercom("hide");

      // register events
      intercom("onHide", this.handleCallback.bind(this, false));
      intercom("onShow", this.handleCallback.bind(this, true));
    }
  },

  handleCallback: function (value) {
    // only handle change if there is one
    if (this.get("isOpen") !== value) {
      this.handleChange(value);
    }
  },

  handleChange: function (value) {
    this.set({isOpen: value});
    this.emitChange(EventTypes.INTERCOM_CHANGE);
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
