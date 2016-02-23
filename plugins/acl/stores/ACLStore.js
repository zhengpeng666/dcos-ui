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
import ACLList from '../../../src/js/structs/ACLList';
import AppDispatcher from '../../../src/js/events/AppDispatcher';

import {SERVER_ACTION} from '../../../src/js/constants/ActionTypes';
import GetSetMixin from '../../../src/js/mixins/GetSetMixin';

import PluginBridge from '../../../src/js/pluginBridge/PluginBridge';

const ACLStore = Store.createStore({
  storeID: 'acl',

  mixins: [GetSetMixin],

  getSet_data: {
    services: new ACLList(),
    outstandingGrants: {}
  },

  dispatchAction: function (action) {
    PluginBridge.dispatch(action);
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
    this.emit(ACL_RESOURCE_ACLS_CHANGE);
    ACLStore.processOutstandingGrants();
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
        ACLStore.fetchACLsForResource('service');
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
