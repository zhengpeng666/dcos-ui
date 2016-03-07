import {
  REQUEST_ACL_USERS_SUCCESS,
  REQUEST_ACL_USERS_ERROR
} from '../constants/ActionTypes';

import {
  ACL_USERS_CHANGE,
  ACL_USERS_REQUEST_ERROR
} from '../constants/EventTypes';

import ACLUsersActions from '../actions/ACLUsersActions';
import UsersList from '../structs/UsersList';

let SDK = require('../../../SDK').getSDK();

const ACLUsersStore = SDK.createStore({
  storeID: 'users',

  mixinEvents: {
  events: {
      success: ACL_USERS_CHANGE,
      error: ACL_USERS_REQUEST_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  fetchUsers: ACLUsersActions.fetch,

  getUsers() {
    return new UsersList({
      items: SDK.Store.getOwnState().users.list
    });
  },

  processUsers: function (users) {
    SDK.dispatch({
      type: ACL_USERS_CHANGE,
      users
    });
    this.emit(ACL_USERS_CHANGE);
  },

  processUsersError: function (error) {
    this.emit(ACL_USERS_REQUEST_ERROR, error);
  }
});

SDK.onDispatch(function (action) {
  switch (action.type) {
    case REQUEST_ACL_USERS_SUCCESS:
      ACLUsersStore.processUsers(action.data);
      break;
    case REQUEST_ACL_USERS_ERROR:
      ACLUsersStore.processUsersError(action.data);
      break;
  }
});

module.exports = ACLUsersStore;
