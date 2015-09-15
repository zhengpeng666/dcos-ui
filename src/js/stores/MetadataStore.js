var _ = require("underscore");

var AppDispatcher = require("../events/AppDispatcher");
var ActionTypes = require("../constants/ActionTypes");
var EventTypes = require("../constants/EventTypes");
var GetSetMixin = require("../mixins/GetSetMixin");
var Store = require("../utils/Store");

var MetadataStore = Store.createStore({

  init: function () {
    this.set({metadata: {}});
  },

  mixins: [GetSetMixin],

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
    if (source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    var action = payload.action;

    switch (action.type) {
      case ActionTypes.REQUEST_METADATA:
        var oldMetadata = MetadataStore.get("metadata");
        var metadata = action.data;

        // only emitting on change
        if (!_.isEqual(oldMetadata, metadata)) {
          MetadataStore.set({metadata});
          MetadataStore.emitChange(EventTypes.METADATA_CHANGE);
        }
        break;
      case ActionTypes.REQUEST_DCOS_METADATA:
        var oldDCOSMetadata = MetadataStore.get("dcosMetadata");
        var dcosMetadata = action.data;

        // only emitting on change
        if (!_.isEqual(oldDCOSMetadata, dcosMetadata)) {
          MetadataStore.set({dcosMetadata});
          MetadataStore.emitChange(EventTypes.DCOS_METADATA_CHANGE);
        }
        break;
    }

    return true;
  })

});

module.exports = MetadataStore;
