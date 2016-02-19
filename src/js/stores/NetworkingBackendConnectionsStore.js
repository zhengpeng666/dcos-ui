import {Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import EventTypes from '../constants/EventTypes';
import GetSetMixin from '../mixins/GetSetMixin';
import NetworkingActions from '../events/NetworkingActions';

let NetworkingBackendConnectionsStore = Store.createStore({
  storeID: 'networkingBackendConnections',

  mixins: [GetSetMixin],

  getSet_data: {
    backendConnections: {},
    nodeMemberships: [],
    vips: [],
    vipDetail: {},
    vipSummaries: []
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  fetchVIPBackendConnections: NetworkingActions.fetchVIPBackendConnections,

  processBackendConnections: function (vip, backendConnections) {
    let currentBackendConnections = this.get('backendConnections');
    currentBackendConnections[vip] = backendConnections;
    this.set({backendConnections: currentBackendConnections});
    this.emit(EventTypes.NETWORKING_BACKEND_CONNECTIONS_CHANGE, vip);
  },

  processBackendConnectionsError: function (vip, error) {
    this.emit(EventTypes.NETWORKING_BACKEND_CONNECTIONS_REQUEST_ERROR, error, vip);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    if (payload.source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    let action = payload.action;
    switch (action.type) {
      case ActionTypes.REQUEST_NETWORKING_BACKEND_CONNECTIONS_SUCCESS:
        NetworkingBackendConnectionsStore.processBackendConnections(action.vip, action.data);
        break;
      case ActionTypes.REQUEST_NETWORKING_BACKEND_CONNECTIONS_ERROR:
        NetworkingBackendConnectionsStore.processBackendConnectionsError(action.vip, action.data);
        break;
    }

    return true;
  })

});

module.exports = NetworkingBackendConnectionsStore;
