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
    services: new ACLList({items: []})
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  fetchACLsForResource: ACLActions.fetchACLsForResource,

  grantUserActionToResource: ACLActions.grantUserActionToResource,

  revokeUserActionToResource: ACLActions.revokeUserActionToResource,

  grantGroupActionToResource: ACLActions.grantGroupActionToResource,

  revokeGroupActionToResource: ACLActions.revokeGroupActionToResource,

  processResourcesACLs: function (items = []) {
    this.set({services: new ACLList({items})});
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
        ACLStore.processResourcesACLs(action.data, action.resourceType);
        break;
      case ActionTypes.REQUEST_ACL_RESOURCE_ACLS_ERROR:
        ACLStore.emit(
            EventTypes.ACL_RESOURCE_ACLS_ERROR,
            action.data,
            action.resourceType
          );
        break;
      case ActionTypes.REQUEST_ACL_USER_GRANT_ACTION_SUCCESS:
        ACLStore.emit(
          EventTypes.ACL_USER_GRANT_ACTION_CHANGE,
          action.triple
        );
        break;
      case ActionTypes.REQUEST_ACL_USER_GRANT_ACTION_ERROR:
        ACLStore.emit(
          EventTypes.ACL_USER_GRANT_ACTION_ERROR,
          action.data,
          action.triple
        );
        break;
      case ActionTypes.REQUEST_ACL_USER_REVOKE_ACTION_SUCCESS:
        ACLStore.emit(
            EventTypes.ACL_USER_REVOKE_ACTION_CHANGE,
            action.triple
          );
        break;
      case ActionTypes.REQUEST_ACL_USER_REVOKE_ACTION_ERROR:
        ACLStore.emit(
          EventTypes.ACL_USER_REVOKE_ACTION_ERROR,
          action.data,
          action.triple
        );
        break;
      case ActionTypes.REQUEST_ACL_GROUP_GRANT_ACTION_SUCCESS:
        ACLStore.emit(
            EventTypes.ACL_GROUP_GRANT_ACTION_CHANGE,
            action.triple
          );
        break;
      case ActionTypes.REQUEST_ACL_GROUP_GRANT_ACTION_ERROR:
        ACLStore.emit(
          EventTypes.ACL_GROUP_GRANT_ACTION_ERROR,
          action.data,
          action.triple
        );
        break;
      case ActionTypes.REQUEST_ACL_GROUP_REVOKE_ACTION_SUCCESS:
        ACLStore.emit(
            EventTypes.ACL_GROUP_REVOKE_ACTION_CHANGE,
            action.triple
          );
        break;
      case ActionTypes.REQUEST_ACL_GROUP_REVOKE_ACTION_ERROR:
        ACLStore.emit(
          EventTypes.ACL_GROUP_REVOKE_ACTION_ERROR,
          action.data,
          action.triple
        );
        break;
    }

    return true;
  })

});

export default ACLStore;
