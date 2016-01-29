import {Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import ACLActions from '../events/ACLActions';
import ACLList from '../structs/ACLList';
import AppDispatcher from '../events/AppDispatcher';
import EventTypes from '../constants/EventTypes';
import GetSetMixin from '../mixins/GetSetMixin';

const ACLStore = Store.createStore({
  storeID: 'acl',

  mixins: [GetSetMixin],

  getSet_data: {
    services: new ACLList(),
    outstandingGrants: {}
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  createACLForResource: ACLActions.createACLForResource,

  fetchACLsForResource: ACLActions.fetchACLsForResource,

  grantUserActionToResource: function (...args) {
    this.safeGrantRequest(ACLActions.grantUserActionToResource, ...args);
  },

  revokeUserActionToResource: ACLActions.revokeUserActionToResource,

  grantGroupActionToResource: function (...args) {
    this.safeGrantRequest(ACLActions.grantGroupActionToResource, ...args);
  },

  revokeGroupActionToResource: ACLActions.revokeGroupActionToResource,

  hasACL: function (resourceID) {
    return this.get('services').getItem(resourceID) !== undefined;
  },

  addOutstandingGrantRequest: function (resourceID, cb) {
    let outstandingGrants = this.get('outstandingGrants');
    if (!(resourceID in outstandingGrants)) {
      outstandingGrants[resourceID] = [];
    }
    outstandingGrants[resourceID].push(cb);
    this.set({outstandingGrants: outstandingGrants});
  },

  removeAllOutstandingGrantRequests: function (resourceID) {
    let outstandingGrants = this.get('outstandingGrants');
    delete outstandingGrants[resourceID];
    this.set({'outstandingGrants': outstandingGrants});
  },

  safeGrantRequest: function (aclActionFn, subjectID, action, resourceID) {
    // First check if ACL exists before requesting grant
    if (ACLStore.hasACL(resourceID)) {
      aclActionFn(subjectID, action, resourceID);
      return;
    }
    // Add grant request to callback list and create ACL
    ACLStore.addOutstandingGrantRequest(resourceID, function () {
      aclActionFn(subjectID, action, resourceID);
    });
    let ACL = {
      description: resourceID.split('.')[1] + ' service'
    };
    ACLStore.createACLForResource(resourceID, ACL);
  },

  processOutstandingGrants: function () {
    let outstandingGrants = this.get('outstandingGrants');
    this.get('services').getItems().forEach(function (acl) {
      let resourceID = acl.get('rid');
      if (resourceID in outstandingGrants) {
        // Run grant requests now that we have an ACL
        outstandingGrants[resourceID].forEach(function (cb) {
          cb();
        });
        ACLStore.removeAllOutstandingGrantRequests(resourceID);
      }
    });
  },

  processResourcesACLs: function (items = []) {
    this.set({services: new ACLList({items})});
    this.emit(EventTypes.ACL_RESOURCE_ACLS_CHANGE);
    ACLStore.processOutstandingGrants();
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let source = payload.source;
    if (source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    let action = payload.action;

    switch (action.type) {
      // Create ACL for resource
      case ActionTypes.REQUEST_ACL_CREATE_SUCCESS:
        ACLStore.fetchACLsForResource('service');
        ACLStore.emit(
            EventTypes.ACL_CREATE_SUCCESS,
            action.resourceID
          );
        break;
      case ActionTypes.REQUEST_ACL_CREATE_ERROR:
        ACLStore.removeAllOutstandingGrantRequests(action.resourceID);
        ACLStore.emit(
            EventTypes.ACL_CREATE_ERROR,
            action.data,
            action.resourceID
          );
        break;
      // Get ACLs for resource
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
      // Grant permission for user
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
      // Revoke permission for user
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
      // Grant permission for group
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
      // Revoke permission for group
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
