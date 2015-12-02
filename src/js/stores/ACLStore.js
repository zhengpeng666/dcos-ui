import ActionTypes from "../constants/ActionTypes";
import ACLActions from "../events/ACLActions";
import ACLList from "../structs/ACLList";
import AppDispatcher from "../events/AppDispatcher";
import EventTypes from "../constants/EventTypes";
import GetSetMixin from "../mixins/GetSetMixin";
import Store from "../utils/Store";

const ACLStore = Store.createStore({
  storeID: "acl",

  mixins: [GetSetMixin],

  getSet_data: {
    services: []
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  fetchACLsForResource: ACLActions.fetchACLsForResource,

  getACLsForType: function (type) {
    return new ACLList({items: this.get(type)});
  },

  grantUserActionToResource: ACLActions.grantUserActionToResource,

  revokeUserActionToResource: ACLActions.revokeUserActionToResource,

  grantGroupActionToResource: ACLActions.grantGroupActionToResource,

  revokeGroupActionToResource: ACLActions.revokeGroupActionToResource,

  processResourcesACLs: function (services) {
    this.set({services});
    this.emit(EventTypes.ACL_RESOURCE_ACLS_CHANGE);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let source = payload.source;
    if (source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    let action = payload.action;

    switch (action.type) {
      case ActionTypes.REQUEST_ACL_RESOURCE_ACLS_SUCCESS:
        ACLStore.processResourcesACLs(action.data);
        break;
      case ActionTypes.REQUEST_ACL_RESOURCE_ACLS_ERROR:
        ACLStore.emit(EventTypes.ACL_RESOURCE_ACLS_REQUEST_ERROR, action.data);
        break;
      case ActionTypes.REQUEST_ACL_USER_GRANT_ACTION_SUCCESS:
        ACLStore.emit(
          EventTypes.ACL_USER_GRANT_ACTION_ACLS_CHANGE,
          action.data
        );
        break;
      case ActionTypes.REQUEST_ACL_USER_GRANT_ACTION_ERROR:
        ACLStore.emit(
          EventTypes.ACL_USER_GRANT_ACTION_REQUEST_ERROR,
          action.data
        );
        break;
      case ActionTypes.REQUEST_ACL_USER_REVOKE_ACTION_SUCCESS:
        ACLStore.emit(EventTypes.ACL_USER_REVOKE_ACTION_CHANGE, action.data);
        break;
      case ActionTypes.REQUEST_ACL_USER_REVOKE_ACTION_ERROR:
        ACLStore.emit(
          EventTypes.ACL_USER_REVOKE_ACTION_REQUEST_ERROR,
          action.data
        );
        break;
      case ActionTypes.REQUEST_ACL_GROUP_GRANT_ACTION_SUCCESS:
        ACLStore.emit(EventTypes.ACL_GROUP_GRANT_ACTION_CHANGE, action.data);
        break;
      case ActionTypes.REQUEST_ACL_GROUP_GRANT_ACTION_ERROR:
        ACLStore.emit(
          EventTypes.ACL_GROUP_GRANT_ACTION_REQUEST_ERROR,
          action.data
        );
        break;
      case ActionTypes.REQUEST_ACL_GROUP_REVOKE_ACTION_SUCCESS:
        ACLStore.emit(EventTypes.ACL_GROUP_REVOKE_ACTION_CHANGE, action.data);
        break;
      case ActionTypes.REQUEST_ACL_GROUP_REVOKE_ACTION_ERROR:
        ACLStore.emit(
          EventTypes.ACL_GROUP_REVOKE_ACTION_REQUEST_ERROR,
          action.data
        );
        break;
    }

    return true;
  })

});

export default ACLStore;
