import {Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import EventTypes from '../constants/EventTypes';
import GetSetMixin from '../mixins/GetSetMixin';
import NetworkingActions from '../events/NetworkingActions';

let NetworkingVIPSummariesStore = Store.createStore({
  storeID: 'networkingVIPSummaries',

  mixins: [GetSetMixin],

  getSet_data: {
    vipSummaries: []
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  fetchVIPSummaries: NetworkingActions.fetchVIPSummaries,

  processVIPSummaries: function (vipSummaries) {
    this.set({vipSummaries});
    this.emit(EventTypes.NETWORKING_VIP_SUMMARIES_CHANGE);
  },

  processVIPSummariesError: function (error) {
    this.emit(EventTypes.NETWORKING_VIP_SUMMARIES_ERROR, error);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    if (payload.source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    let action = payload.action;
    switch (action.type) {
      case ActionTypes.REQUEST_NETWORKING_VIP_SUMMARIES_SUCCESS:
        NetworkingVIPSummariesStore.processVIPSummaries(action.data);
        break;
      case ActionTypes.REQUEST_NETWORKING_VIP_SUMMARIES_ERROR:
        NetworkingVIPSummariesStore.processVIPSummariesError(action.data);
        break;
    }

    return true;
  })

});

module.exports = NetworkingVIPSummariesStore;
