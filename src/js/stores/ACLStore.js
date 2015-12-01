import ACLActions from "../events/ACLActions";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../events/AppDispatcher";
import EventTypes from "../constants/EventTypes";
import GetSetMixin from "../mixins/GetSetMixin";
import ACLList from "../structs/ACLList";
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

  fetchServices: ACLActions.fetchACLs,

  grantUserActionToResource: ACLActions.grantUserActionToResource,

  revokeUserActionToResource: ACLActions.revokeUserActionToResource,

  grantGroupActionToResource: ACLActions.grantGroupActionToResource,

  revokeGroupActionToResource: ACLActions.revokeGroupActionToResource,

  processServiceResources: function (services) {
    this.set({
      services: new ACLList({items: services})
    });

    this.emit(EventTypes.ACL_RESOURCE_CHANGE);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let source = payload.source;
    if (source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    let action = payload.action;

    switch (action.type) {
      case ActionTypes.REQUEST_ACL_RESOURCE_SUCCESS:
        ACLStore.processServiceResources(action.data);
        break;
      case ActionTypes.REQUEST_ACL_RESOURCE_ERROR:
        ACLStore.emit(EventTypes.ACL_REQUEST_RESOURCE_ERROR, action.data);
        break;
      case ActionTypes.REQUEST_ACL_GRANT_USER_ACTION_SUCCESS:
        ACLStore.emit(EventTypes.ACL_USER_GRANT_ACTION_CHANGE, action.data);
        break;
      case ActionTypes.REQUEST_ACL_GRANT_USER_ACTION_ERROR:
        ACLStore.emit(EventTypes.ACL_USER_GRANT_ACTION_REQUEST_ERROR, action.data);
        break;
      case ActionTypes.REQUEST_ACL_REVOKE_USER_ACTION_SUCCESS:
        ACLStore.emit(EventTypes.ACL_USER_REVOKE_ACTION_CHANGE, action.data);
        break;
      case ActionTypes.REQUEST_ACL_REVOKE_USER_ACTION_ERROR:
        ACLStore.emit(EventTypes.ACL_USER_REVOKE_ACTION_REQUEST_ERROR, action.data);
        break;
      case ActionTypes.REQUEST_ACL_GRANT_GROUP_ACTION_SUCCESS:
        ACLStore.emit(EventTypes.ACL_GROUP_GRANT_ACTION_CHANGE, action.data);
        break;
      case ActionTypes.REQUEST_ACL_GRANT_GROUP_ACTION_ERROR:
        ACLStore.emit(EventTypes.ACL_GROUP_GRANT_ACTION_REQUEST_ERROR, action.data);
        break;
      case ActionTypes.REQUEST_ACL_REVOKE_GROUP_ACTION_SUCCESS:
        ACLStore.emit(EventTypes.ACL_GROUP_REVOKE_ACTION_CHANGE, action.data);
        break;
      case ActionTypes.REQUEST_ACL_REVOKE_GROUP_ACTION_ERROR:
        ACLStore.emit(EventTypes.ACL_GROUP_REVOKE_ACTION_REQUEST_ERROR, action.data);
        break;
    }

    return true;
  })

});

export default ACLStore;
