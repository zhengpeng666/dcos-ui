import {
  NETWORKING_BACKEND_CONNECTIONS_CHANGE,
  NETWORKING_BACKEND_CONNECTIONS_REQUEST_ERROR
} from '../constants/EventTypes';

import {
  REQUEST_NETWORKING_BACKEND_CONNECTIONS_SUCCESS,
  REQUEST_NETWORKING_BACKEND_CONNECTIONS_ERROR
} from '../constants/ActionTypes';

import NetworkingActions from '../actions/NetworkingActions';

let SDK = require('../SDK').getSDK();

let NetworkingBackendConnectionsStore = SDK.createStore({
  storeID: 'networkingBackendConnections',

  mixinEvents: {
    events: {
      success: NETWORKING_BACKEND_CONNECTIONS_CHANGE,
      error: NETWORKING_BACKEND_CONNECTIONS_REQUEST_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  fetchVIPBackendConnections: NetworkingActions.fetchVIPBackendConnections,

  get(prop) {
    return SDK.Store.getOwnState()[prop];
  },

  processBackendConnections: function (vip, backendConnections) {
    let currentBackendConnections = this.get('backendConnections');
    currentBackendConnections[vip] = backendConnections;
    SDK.dispatch({
      type: NETWORKING_BACKEND_CONNECTIONS_CHANGE,
      backendConnections: currentBackendConnections
    });

    this.emit(NETWORKING_BACKEND_CONNECTIONS_CHANGE, vip);
  },

  processBackendConnectionsError: function (vip, error) {
    this.emit(NETWORKING_BACKEND_CONNECTIONS_REQUEST_ERROR, error, vip);
  }
});

SDK.onDispatch(function (action) {
  switch (action.type) {
    case REQUEST_NETWORKING_BACKEND_CONNECTIONS_SUCCESS:
      NetworkingBackendConnectionsStore
      .processBackendConnections(action.vip, action.data);
      break;
    case REQUEST_NETWORKING_BACKEND_CONNECTIONS_ERROR:
      NetworkingBackendConnectionsStore
      .processBackendConnectionsError(action.vip, action.data);
      break;
  }
});

module.exports = NetworkingBackendConnectionsStore;
