import {Store} from 'mesosphere-shared-reactjs';

import {
  REQUEST_ACL_USERS_SUCCESS,
  REQUEST_ACL_USERS_ERROR
} from '../constants/ActionTypes';

import {
  ACL_USERS_CHANGE,
  ACL_USERS_REQUEST_ERROR
} from '../constants/EventTypes';

import _ACLUsersActions from '../actions/ACLUsersActions';
import UsersList from '../../../../../src/js/structs/UsersList';

import AppDispatcher from '../../../../../src/js/events/AppDispatcher';
import {SERVER_ACTION} from '../../../../../src/js/constants/ActionTypes';

let cachedStore;

module.exports = (PluginSDK) => {
  // Return cached version if exists
  if (cachedStore) {
    return cachedStore;
  }
  let PluginGetSetMixin = PluginSDK.get('PluginGetSetMixin');
  let {APP_STORE_CHANGE} = PluginSDK.constants;

  let ACLUsersActions = _ACLUsersActions(PluginSDK);

  const ACLUsersStore = Store.createStore({
    storeID: 'users',

    mixins: [PluginGetSetMixin],

    getSet_data: {
      users: new UsersList()
    },

    onSet() {
      PluginSDK.dispatch({
        type: APP_STORE_CHANGE,
        storeID: this.storeID,
        data: this.getSet_data
      });
    },

    addChangeListener: function (eventName, callback) {
      this.on(eventName, callback);
    },

    removeChangeListener: function (eventName, callback) {
      this.removeListener(eventName, callback);
    },

    fetchUsers: ACLUsersActions.fetch,

    processUsers: function (users) {
      this.set({
        users: new UsersList({
          items: users
        })
      });
      this.emit(ACL_USERS_CHANGE);
    },

    processUsersError: function (error) {
      this.emit(ACL_USERS_REQUEST_ERROR, error);
    },

    dispatcherIndex: AppDispatcher.register(function (payload) {
      let source = payload.source;
      if (source !== SERVER_ACTION) {
        return false;
      }

      let action = payload.action;

      switch (action.type) {
        case REQUEST_ACL_USERS_SUCCESS:
          ACLUsersStore.processUsers(action.data);
          break;
        case REQUEST_ACL_USERS_ERROR:
          ACLUsersStore.processUsersError(action.data);
          break;
      }

      return true;
    })
  });

  cachedStore = ACLUsersStore;

  return ACLUsersStore;
};
