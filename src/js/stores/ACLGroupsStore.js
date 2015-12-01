import ACLGroupsActions from "../events/ACLGroupsActions";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../events/AppDispatcher";
import EventTypes from "../constants/EventTypes";
import GetSetMixin from "../mixins/GetSetMixin";
import GroupsList from "../structs/GroupsList";
import Store from "../utils/Store";

const ACLGroupsStore = Store.createStore({
  storeID: "groups",

  mixins: [GetSetMixin],

  getSet_data: {
    groups: []
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
    this.emit(EventTypes.ACL_GROUPS_CHANGE);
  },

  processGroupsError: function () {
    this.emit(EventTypes.ACL_GROUPS_REQUEST_ERROR);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let source = payload.source;
    if (source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    let action = payload.action;

    switch (action.type) {
      case ActionTypes.REQUEST_ACL_GROUPS_SUCCESS:
        ACLGroupsStore.processGroups(action.data);
        break;
      case ActionTypes.REQUEST_ACL_GROUPS_ERROR:
        ACLGroupsStore.processGroupsError();
        break;
    }

    return true;
  })

});

export default ACLGroupsStore;
