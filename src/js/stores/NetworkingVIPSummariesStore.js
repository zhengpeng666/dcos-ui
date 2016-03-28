import _ from 'underscore';
import {Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import Config from '../config/Config';
import {
  NETWORKING_VIP_SUMMARIES_CHANGE,
  NETWORKING_VIP_SUMMARIES_ERROR,
  VISIBILITY_CHANGE
} from '../constants/EventTypes';
import GetSetMixin from '../mixins/GetSetMixin';
import NetworkingActions from '../events/NetworkingActions';
import VIPSummaryList from '../structs/VIPSummaryList';
import VisibilityStore from './VisibilityStore';

let requestInterval = null;

function startPolling() {
  if (requestInterval == null) {
    NetworkingActions.fetchVIPSummaries();
    requestInterval = setInterval(
      NetworkingActions.fetchVIPSummaries, Config.getRefreshRate()
    );
  }
}

function stopPolling() {
  if (requestInterval != null) {
    clearInterval(requestInterval);
    requestInterval = null;
  }
}

function handleInactiveChange() {
  let isInactive = VisibilityStore.get('isInactive');
  if (isInactive) {
    stopPolling();
  }

  if (!isInactive && NetworkingVIPSummariesStore.shouldPoll()) {
    startPolling();
  }
}

VisibilityStore.addChangeListener(VISIBILITY_CHANGE, handleInactiveChange);

let NetworkingVIPSummariesStore = Store.createStore({
  storeID: 'networkingVIPSummaries',

  mixins: [GetSetMixin],

  getSet_data: {
    vipSummaries: []
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
    startPolling();
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);

    if (!this.shouldPoll()) {
      stopPolling();
    }
  },

  shouldPoll: function () {
    return !_.isEmpty(this.listeners(NETWORKING_VIP_SUMMARIES_CHANGE));
  },

  fetchVIPSummaries: NetworkingActions.fetchVIPSummaries,

  getVIPSummaries() {
    return new VIPSummaryList({items: this.get('vipSummaries')});
  },

  processVIPSummaries: function (vipSummaries) {
    this.set({vipSummaries});
    this.emit(NETWORKING_VIP_SUMMARIES_CHANGE);
  },

  processVIPSummariesError: function (error) {
    this.emit(NETWORKING_VIP_SUMMARIES_ERROR, error);
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
