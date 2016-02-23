import {Store} from 'mesosphere-shared-reactjs';

var AppDispatcher = require('../../../src/js/events/AppDispatcher');

import {
  INTERCOM_ACTION,
  REQUEST_INTERCOM_CLOSE,
  REQUEST_INTERCOM_OPEN
} from '../constants/ActionTypes';

import {INTERCOM_CHANGE} from '../constants/EventTypes';
var GetSetMixin = require('../../../src/js/mixins/GetSetMixin');

var IntercomStore = Store.createStore({
  storeID: 'intercom',

  mixins: [GetSetMixin],

  init: function () {
    this.set({isOpen: false});

    var intercom = global.Intercom;
    if (intercom != null) {
      // make sure to hide Intercom on load
      intercom('hide');

      // register events
      intercom('onHide', this.handleChange.bind(this, false));
      intercom('onShow', this.handleChange.bind(this, true));
    }
  },

  handleChange: function (isOpen) {
    // only handle change if there is one
    if (this.get('isOpen') !== isOpen) {
      this.set({isOpen});
      this.emit(INTERCOM_CHANGE);
    }
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    var source = payload.source;
    if (source !== INTERCOM_ACTION) {
      return false;
    }

    var action = payload.action;

    switch (action.type) {
      case REQUEST_INTERCOM_CLOSE:
      case REQUEST_INTERCOM_OPEN:
        IntercomStore.handleChange(action.data);
        break;
    }

    return true;
  })

});

module.exports = IntercomStore;
