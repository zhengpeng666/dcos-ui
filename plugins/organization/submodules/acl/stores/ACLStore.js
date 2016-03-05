import {Store} from 'mesosphere-shared-reactjs';

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
import ACLList from '../../../../../src/js/structs/ACLList';

import AppDispatcher from '../../../../../src/js/events/AppDispatcher';
import {SERVER_ACTION} from '../../../../../src/js/constants/ActionTypes';

let SDK = require('../../../SDK').getSDK();

let PluginGetSetMixin = SDK.get('PluginGetSetMixin');
let {APP_STORE_CHANGE} = SDK.constants;

const ACLStore = Store.createStore({
  storeID: 'acl',

  mixins: [PluginGetSetMixin],

  getSet_data: {
    outstandingGrants: {}
  },

  onSet() {
    SDK.dispatch({
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
    let outstandingGrants = this.get('outstandingGrants');
    if (!(resourceID in outstandingGrants)) {
      outstandingGrants[resourceID] = [];
    }
    outstandingGrants[resourceID].push(cb);
    this.set({outstandingGrants});
  },

  removeAllOutstandingGrantRequests: function (resourceID) {
    let outstandingGrants = this.get('outstandingGrants');
    delete outstandingGrants[resourceID];
    this.set({outstandingGrants});
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
    let outstandingGrants = this.get('outstandingGrants');
    this.getACLs(resourceType).getItems().forEach(function (acl) {
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

  processResourcesACLs: function (items = [], resourceType = 'allACLs') {
    this.set({[resourceType]: items});
    this.emit(ACL_RESOURCE_ACLS_CHANGE);
    ACLStore.processOutstandingGrants(resourceType);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let source = payload.source;
    if (source !== SERVER_ACTION) {
      return false;
    }

    let action = payload.action;

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

    return true;
  })
});

module.exports = ACLStore;

