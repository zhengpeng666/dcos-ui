import {Store} from 'mesosphere-shared-reactjs';

import {
  REQUEST_ACL_GROUPS_SUCCESS,
  REQUEST_ACL_GROUPS_ERROR
} from '../constants/ActionTypes';

import {
  ACL_GROUPS_CHANGE,
  ACL_GROUPS_REQUEST_ERROR
} from '../constants/EventTypes';

import {SERVER_ACTION} from '../../../src/js/constants/ActionTypes';

import ACLGroupsActions from '../actions/ACLGroupsActions';
import AppDispatcher from '../../../src/js/events/AppDispatcher';
import GetSetMixin from '../../../src/js/mixins/GetSetMixin';
import GroupsList from '../../../src/js/structs/GroupsList';
// import PluginBridge from '../../../src/js/pluginBridge/PluginBridge';

const ACLGroupsStore = Store.createStore({
  storeID: 'groups',

  mixins: [GetSetMixin],

  getSet_data: {
    groups: new GroupsList()
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  fetchGroups: ACLGroupsActions.fetch,

  processGroups: function (groups) {
    this.set({
      groups: new GroupsList({
        items: groups
      })
    });
    this.emit(ACL_GROUPS_CHANGE);
  },

  processGroupsError: function (error) {
    this.emit(ACL_GROUPS_REQUEST_ERROR, error);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let source = payload.source;
    if (source !== SERVER_ACTION) {
      return false;
    }

    let action = payload.action;

    switch (action.type) {
      case REQUEST_ACL_GROUPS_SUCCESS:
        ACLGroupsStore.processGroups(action.data);
        break;
      case REQUEST_ACL_GROUPS_ERROR:
        ACLGroupsStore.processGroupsError(action.data);
        break;
    }

    return true;
  })
});

module.exports = ACLGroupsStore;
