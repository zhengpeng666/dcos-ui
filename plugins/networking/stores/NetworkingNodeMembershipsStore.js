import {Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../../../src/js/events/AppDispatcher';
import EventTypes from '../constants/EventTypes';
import GetSetMixin from '../../../src/js/mixins/GetSetMixin';
import NetworkingActions from '../actions/NetworkingActions';
import {SERVER_ACTION} from '../../../src/js/constants/ActionTypes';

let NetworkingNodeMembershipsStore = Store.createStore({
  storeID: 'networkingNodeMemberships',

  mixins: [GetSetMixin],

  getSet_data: {
    nodeMemberships: []
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  fetchNodeMemberships: NetworkingActions.fetchNodeMemberships,

  processNodeMemberships: function (nodeMemberships) {
    this.set({nodeMemberships});
    this.emit(EventTypes.NETWORKING_NODE_MEMBERSHIP_CHANGE);
  },

  processNodeMembershipsError: function (error) {
    this.emit(EventTypes.NETWORKING_NODE_MEMBERSHIP_REQUEST_ERROR, error);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    if (payload.source !== SERVER_ACTION) {
      return false;
    }

    let action = payload.action;
    switch (action.type) {
      case ActionTypes.REQUEST_NETWORKING_NODE_MEMBERSHIPS_SUCCESS:
        NetworkingNodeMembershipsStore.processNodeMemberships(action.data);
        break;
      case ActionTypes.REQUEST_NETWORKING_NODE_MEMBERSHIPS_ERROR:
        NetworkingNodeMembershipsStore.processNodeMembershipsError(action.data);
        break;
    }

    return true;
  })

});

module.exports = NetworkingNodeMembershipsStore;
