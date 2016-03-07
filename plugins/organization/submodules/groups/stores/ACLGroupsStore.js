import {
  REQUEST_ACL_GROUPS_SUCCESS,
  REQUEST_ACL_GROUPS_ERROR
} from '../constants/ActionTypes';

import {
  ACL_GROUPS_CHANGE,
  ACL_GROUPS_REQUEST_ERROR
} from '../constants/EventTypes';

let SDK = require('../../../SDK').getSDK();

import ACLGroupsActions from '../actions/ACLGroupsActions';

import GroupsList from '../structs/GroupsList';

let SDK = require('../../../SDK').getSDK();

const ACLGroupsStore = SDK.createStore({
  storeID: 'groups',

  mixinEvents: {
    events: {
      success: ACL_GROUPS_CHANGE,
      error: ACL_GROUPS_REQUEST_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  fetchGroups: ACLGroupsActions.fetch,

  getGroups() {
    return new GroupsList({items: SDK.Store.getOwnState().groups.list});
  },

  processGroups: function (groups) {
    SDK.dispatch({
      type: ACL_GROUPS_CHANGE,
      groups
    });
    this.emit(ACL_GROUPS_CHANGE);
  },

  processGroupsError: function (error) {
    this.emit(ACL_GROUPS_REQUEST_ERROR, error);
  }
});

SDK.onDispatch(function (action) {
  switch (action.type) {
    case REQUEST_ACL_GROUPS_SUCCESS:
      ACLGroupsStore.processGroups(action.data);
      break;
    case REQUEST_ACL_GROUPS_ERROR:
      ACLGroupsStore.processGroupsError(action.data);
      break;
  }

  return true;
});

module.exports = ACLGroupsStore;
