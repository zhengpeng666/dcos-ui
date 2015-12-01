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

  fetchServices: ACLActions.fetchACLs.bind(this, "service"),

  grantUserActionToResource:
    ACLActions.grantUserActionToResource.bind(this, "access"),

  revokeUserActionToResource:
    ACLActions.revokeUserActionToResource.bind(this, "access"),

  grantGroupActionToResource:
    ACLActions.grantGroupActionToResource.bind(this, "access"),

  revokeGroupActionToResource:
    ACLActions.revokeGroupActionToResource.bind(this, "access"),

  processServiceResources: function (services) {
    this.set({
      services: new ACLList({items: services})
    });

    this.emit(EventTypes.ACL_CHANGE);
  },

  processResourcesError: function (...args) {
    args.unshift(EventTypes.ACL_REQUEST_ERROR);
    this.emit.apply(this, args);
  },

  processGrantUserAccess: function (...args) {
    args.unshift(EventTypes.ACL_GRANT_USER_ACTION_CHANGE);
    this.emit.apply(this, args);
  },

  processGrantUserAccessError: function (...args) {
    args.unshift(EventTypes.ACL_GRANT_USER_ACTION_REQUEST_ERROR);
    this.emit.apply(this, args);
  },

  processRevokeUserAccess: function (...args) {
    args.unshift(EventTypes.ACL_REVOKE_USER_ACTION_CHANGE);
    this.emit.apply(this, args);
  },

  processRevokeUserAccessError: function (...args) {
    args.unshift(EventTypes.ACL_REVOKE_USER_ACTION_REQUEST_ERROR);
    this.emit.apply(this, args);
  },

  processGrantGroupAccess: function (...args) {
    args.unshift(EventTypes.ACL_GRANT_GROUP_ACTION_CHANGE);
    this.emit.apply(this, args);
  },

  processGrantGroupAccessError: function (...args) {
    args.unshift(EventTypes.ACL_GRANT_GROUP_ACTION_REQUEST_ERROR);
    this.emit.apply(this, args);
  },

  processRevokeGroupAccess: function (...args) {
    args.unshift(EventTypes.ACL_REVOKE_GROUP_ACTION_CHANGE);
    this.emit.apply(this, args);
  },

  processRevokeGroupAccessError: function (...args) {
    args.unshift(EventTypes.ACL_REVOKE_GROUP_ACTION_REQUEST_ERROR);
    this.emit.apply(this, args);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let source = payload.source;
    if (source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    let action = payload.action;

    switch (action.type) {
      case ActionTypes.REQUEST_ACL_SUCCESS:
        ACLStore.processServiceResources(action.data);
        break;
      case ActionTypes.REQUEST_ACL_ERROR:
        ACLStore.processResourcesError();
        break;
      case ActionTypes.REQUEST_ACL_GRANT_USER_ACTION_SUCCESS:
        ACLStore.processGrantUserAccess(action.userID, action.resourceID);
        break;
      case ActionTypes.REQUEST_ACL_GRANT_USER_ACTION_ERROR:
        ACLStore.processGrantUserAccessError(
          action.data,
          action.userID,
          action.resourceID
        );
        break;
      case ActionTypes.REQUEST_ACL_REVOKE_USER_ACTION_SUCCESS:
        ACLStore.processRevokeUserAccess(action.userID, action.resourceID);
        break;
      case ActionTypes.REQUEST_ACL_REVOKE_USER_ACTION_ERROR:
        ACLStore.processRevokeUserAccessError(
          action.data,
          action.userID,
          action.resourceID
        );
        break;
      case ActionTypes.REQUEST_ACL_GRANT_GROUP_ACTION_SUCCESS:
        ACLStore.processGrantGroupAccess(action.groupID, action.resourceID);
        break;
      case ActionTypes.REQUEST_ACL_GRANT_GROUP_ACTION_ERROR:
        ACLStore.processGrantGroupAccessError(
          action.data,
          action.groupID,
          action.resourceID
        );
        break;
      case ActionTypes.REQUEST_ACL_REVOKE_GROUP_ACTION_SUCCESS:
        ACLStore.processRevokeGroupAccess(action.groupID, action.resourceID);
        break;
      case ActionTypes.REQUEST_ACL_REVOKE_GROUP_ACTION_ERROR:
        ACLStore.processRevokeGroupAccessError(
          action.data,
          action.groupID,
          action.resourceID
        );
        break;
    }

    return true;
  })

});

export default ACLStore;
