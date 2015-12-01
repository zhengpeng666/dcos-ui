import ACLUsersActions from "../events/ACLUsersActions";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../events/AppDispatcher";
import EventTypes from "../constants/EventTypes";
import GetSetMixin from "../mixins/GetSetMixin";
import UsersList from "../structs/UsersList";
import Store from "../utils/Store";

const ACLUsersStore = Store.createStore({
  storeID: "users",

  mixins: [GetSetMixin],

  getSet_data: {
    users: []
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
    this.emit(EventTypes.ACL_USERS_CHANGE);
  },

  processUsersError: function () {
    this.emit(EventTypes.ACL_USERS_REQUEST_ERROR);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let source = payload.source;
    if (source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    let action = payload.action;

    switch (action.type) {
      case ActionTypes.REQUEST_ACL_USERS_SUCCESS:
        ACLUsersStore.processUsers(action.data);
        break;
      case ActionTypes.REQUEST_ACL_USERS_ERROR:
        ACLUsersStore.processUsersError();
        break;
    }

    return true;
  })

});

export default ACLUsersStore;
