import {
  NETWORKING_NODE_MEMBERSHIP_CHANGE,
  NETWORKING_NODE_MEMBERSHIP_REQUEST_ERROR
} from '../constants/EventTypes';

import {
  REQUEST_NETWORKING_NODE_MEMBERSHIPS_SUCCESS,
  REQUEST_NETWORKING_NODE_MEMBERSHIPS_ERROR
} from '../constants/ActionTypes';

import NetworkingActions from '../actions/NetworkingActions';

let SDK = require('../SDK').getSDK();

let NetworkingNodeMembershipsStore = SDK.createStore({
  storeID: 'networkingNodeMemberships',

  mixinEvents: {
    events: {
      success: NETWORKING_NODE_MEMBERSHIP_CHANGE,
      error: NETWORKING_NODE_MEMBERSHIP_REQUEST_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  get(prop) {
    return SDK.Store.getOwnState()[prop];
  },

  fetchNodeMemberships: NetworkingActions.fetchNodeMemberships,

  processNodeMemberships: function (nodeMemberships) {
    SDK.dispatch({
      type: NETWORKING_NODE_MEMBERSHIP_CHANGE,
      nodeMemberships
    });
    this.emit(NETWORKING_NODE_MEMBERSHIP_CHANGE);
  },

  processNodeMembershipsError: function (error) {
    this.emit(NETWORKING_NODE_MEMBERSHIP_REQUEST_ERROR, error);
  }
});

SDK.onDispatch(function (action) {
  switch (action.type) {
    case REQUEST_NETWORKING_NODE_MEMBERSHIPS_SUCCESS:
      NetworkingNodeMembershipsStore.processNodeMemberships(action.data);
      break;
    case REQUEST_NETWORKING_NODE_MEMBERSHIPS_ERROR:
      NetworkingNodeMembershipsStore.processNodeMembershipsError(action.data);
      break;
  }
});

module.exports = NetworkingNodeMembershipsStore;
