import {
  REQUEST_ACL_CREATE_SUCCESS,
  REQUEST_ACL_CREATE_ERROR,
  REQUEST_ACL_RESOURCE_ACLS_SUCCESS,
  REQUEST_ACL_RESOURCE_ACLS_ERROR,
  REQUEST_ACL_USER_GRANT_ACTION_SUCCESS,
  REQUEST_ACL_USER_GRANT_ACTION_ERROR,
  REQUEST_ACL_USER_REVOKE_ACTION_SUCCESS,
  REQUEST_ACL_USER_REVOKE_ACTION_ERROR,
  REQUEST_ACL_GROUP_GRANT_ACTION_SUCCESS,
  REQUEST_ACL_GROUP_GRANT_ACTION_ERROR,
  REQUEST_ACL_GROUP_REVOKE_ACTION_SUCCESS,
  REQUEST_ACL_GROUP_REVOKE_ACTION_ERROR
} from '../constants/ActionTypes';

import {
  ACL_RESOURCE_ACLS_CHANGE,
  ACL_CREATE_SUCCESS,
  ACL_CREATE_ERROR,
  ACL_RESOURCE_ACLS_ERROR,
  ACL_USER_GRANT_ACTION_CHANGE,
  ACL_USER_GRANT_ACTION_ERROR,
  ACL_USER_REVOKE_ACTION_CHANGE,
  ACL_USER_REVOKE_ACTION_ERROR,
  ACL_GROUP_GRANT_ACTION_CHANGE,
  ACL_GROUP_GRANT_ACTION_ERROR,
  ACL_GROUP_REVOKE_ACTION_CHANGE,
  ACL_GROUP_REVOKE_ACTION_ERROR
} from '../constants/EventTypes';

import ACLActions from '../actions/ACLActions';
import ACLList from '../structs/ACLList';

let SDK = require('../../../SDK').getSDK();

const ACLStore = SDK.createStore({
  storeID: 'acl',

  mixinEvents: {
    events: {
      createSuccess: ACL_CREATE_SUCCESS,
      createError: ACL_CREATE_ERROR,
      fetchResourceSuccess: ACL_RESOURCE_ACLS_CHANGE,
      fetchResourceError: ACL_RESOURCE_ACLS_ERROR,
      userGrantSuccess: ACL_USER_GRANT_ACTION_CHANGE,
      userGrantError: ACL_USER_GRANT_ACTION_ERROR,
      userRevokeSuccess: ACL_USER_REVOKE_ACTION_CHANGE,
      userRevokeError: ACL_USER_REVOKE_ACTION_ERROR,
      groupGrantSuccess: ACL_GROUP_GRANT_ACTION_CHANGE,
      groupGrantError: ACL_GROUP_GRANT_ACTION_ERROR,
      groupRevokeSuccess: ACL_GROUP_REVOKE_ACTION_CHANGE,
      groupRevokeError: ACL_GROUP_REVOKE_ACTION_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  outstandingGrants: {},

  get(prop) {
    return SDK.Store.getOwnState().acl[prop];
  },

  createACLForResource: ACLActions.createACLForResource,

  fetchACLs: ACLActions.fetchACLs,

  grantUserActionToResource: function (...args) {
    this.safeGrantRequest(ACLActions.grantUserActionToResource, ...args);
  },

  revokeUserActionToResource: ACLActions.revokeUserActionToResource,

  grantGroupActionToResource: function (...args) {
    this.safeGrantRequest(ACLActions.grantGroupActionToResource, ...args);
  },

  revokeGroupActionToResource: ACLActions.revokeGroupActionToResource,

  getACLs: function (resourceType = 'allACLs') {
    return new ACLList({items: this.get(resourceType) || []});
  },

  hasACL: function (resourceType, resourceID) {
    return this.getACLs(resourceType).getItem(resourceID) !== undefined;
  },

  addOutstandingGrantRequest: function (resourceID, cb) {
    if (!(resourceID in this.outstandingGrants)) {
      this.outstandingGrants[resourceID] = [];
    }
    this.outstandingGrants[resourceID].push(cb);
  },

  removeAllOutstandingGrantRequests: function (resourceID) {
    delete this.outstandingGrants[resourceID];
  },

  safeGrantRequest: function (aclActionFn, subjectID, action, resourceID,
    resourceType = 'allACLs') {
    // First check if ACL exists before requesting grant
    if (ACLStore.hasACL(resourceType, resourceID)) {
      aclActionFn(subjectID, action, resourceID);
      return;
    }
    // Add grant request to callback list and create ACL
    ACLStore.addOutstandingGrantRequest(resourceID, function () {
      aclActionFn(subjectID, action, resourceID);
    });

    let ACLObject = {description: resourceID};
    if (/^service/.test(resourceID)) {
      ACLObject.description = resourceID.split('.')[1] + ' service';
    }

    ACLStore.createACLForResource(resourceID, ACLObject);
  },

  processOutstandingGrants: function (resourceType) {
    this.getACLs(resourceType).getItems().forEach(acl => {
      let resourceID = acl.get('rid');
      if (resourceID in this.outstandingGrants) {
        // Run grant requests now that we have an ACL
        this.outstandingGrants[resourceID].forEach(function (cb) {
          cb();
        });
        ACLStore.removeAllOutstandingGrantRequests(resourceID);
      }
    });
  },

  processResourcesACLs: function (items = [], resourceType = 'allACLs') {
    SDK.dispatch({
      type: ACL_RESOURCE_ACLS_CHANGE,
      data: {[resourceType]: items}
    });
    this.emit(ACL_RESOURCE_ACLS_CHANGE);
    ACLStore.processOutstandingGrants(resourceType);
  }
});

SDK.onDispatch(function (action) {
  switch (action.type) {
    // Create ACL for resource
    case REQUEST_ACL_CREATE_SUCCESS:
      ACLStore.fetchACLs();
      ACLStore.emit(
          ACL_CREATE_SUCCESS,
          action.resourceID
        );
      break;
    case REQUEST_ACL_CREATE_ERROR:
      ACLStore.removeAllOutstandingGrantRequests(action.resourceID);
      ACLStore.emit(
          ACL_CREATE_ERROR,
          action.data,
          action.resourceID
        );
      break;
    // Get ACLs for resource
    case REQUEST_ACL_RESOURCE_ACLS_SUCCESS:
      ACLStore.processResourcesACLs(action.data, action.resourceType);
      break;
    case REQUEST_ACL_RESOURCE_ACLS_ERROR:
      ACLStore.emit(
          ACL_RESOURCE_ACLS_ERROR,
          action.data,
          action.resourceType
        );
      break;
    // Grant permission for user
    case REQUEST_ACL_USER_GRANT_ACTION_SUCCESS:
      ACLStore.emit(
        ACL_USER_GRANT_ACTION_CHANGE,
        action.triple
      );
      break;
    case REQUEST_ACL_USER_GRANT_ACTION_ERROR:
      ACLStore.emit(
        ACL_USER_GRANT_ACTION_ERROR,
        action.data,
        action.triple
      );
      break;
    // Revoke permission for user
    case REQUEST_ACL_USER_REVOKE_ACTION_SUCCESS:
      ACLStore.emit(
          ACL_USER_REVOKE_ACTION_CHANGE,
          action.triple
        );
      break;
    case REQUEST_ACL_USER_REVOKE_ACTION_ERROR:
      ACLStore.emit(
        ACL_USER_REVOKE_ACTION_ERROR,
        action.data,
        action.triple
      );
      break;
    // Grant permission for group
    case REQUEST_ACL_GROUP_GRANT_ACTION_SUCCESS:
      ACLStore.emit(
          ACL_GROUP_GRANT_ACTION_CHANGE,
          action.triple
        );
      break;
    case REQUEST_ACL_GROUP_GRANT_ACTION_ERROR:
      ACLStore.emit(
        ACL_GROUP_GRANT_ACTION_ERROR,
        action.data,
        action.triple
      );
      break;
    // Revoke permission for group
    case REQUEST_ACL_GROUP_REVOKE_ACTION_SUCCESS:
      ACLStore.emit(
          ACL_GROUP_REVOKE_ACTION_CHANGE,
          action.triple
        );
      break;
    case REQUEST_ACL_GROUP_REVOKE_ACTION_ERROR:
      ACLStore.emit(
        ACL_GROUP_REVOKE_ACTION_ERROR,
        action.data,
        action.triple
      );
      break;
  }
});

module.exports = ACLStore;

