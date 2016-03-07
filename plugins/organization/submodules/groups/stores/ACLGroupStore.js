import _ from 'underscore';

import {
  REQUEST_ACL_GROUP_SUCCESS,
  REQUEST_ACL_GROUP_ERROR,
  REQUEST_ACL_GROUP_PERMISSIONS_SUCCESS,
  REQUEST_ACL_GROUP_PERMISSIONS_ERROR,
  REQUEST_ACL_GROUP_USERS_SUCCESS,
  REQUEST_ACL_GROUP_USERS_ERROR,
  REQUEST_ACL_GROUP_CREATE_SUCCESS,
  REQUEST_ACL_GROUP_CREATE_ERROR,
  REQUEST_ACL_GROUP_UPDATE_SUCCESS,
  REQUEST_ACL_GROUP_UPDATE_ERROR,
  REQUEST_ACL_GROUP_DELETE_SUCCESS,
  REQUEST_ACL_GROUP_DELETE_ERROR,
  REQUEST_ACL_GROUP_ADD_USER_SUCCESS,
  REQUEST_ACL_GROUP_ADD_USER_ERROR,
  REQUEST_ACL_GROUP_REMOVE_USER_SUCCESS,
  REQUEST_ACL_GROUP_REMOVE_USER_ERROR
} from '../constants/ActionTypes';

import {
  ACL_GROUP_SET_GROUPS,
  ACL_GROUP_SET_GROUPS_FETCHING,
  ACL_GROUP_DETAILS_FETCHED_SUCCESS,
  ACL_GROUP_DETAILS_FETCHED_ERROR,
  ACL_GROUP_DETAILS_GROUP_CHANGE,
  ACL_GROUP_DETAILS_GROUP_ERROR,
  ACL_GROUP_DETAILS_PERMISSIONS_CHANGE,
  ACL_GROUP_DETAILS_PERMISSIONS_ERROR,
  ACL_GROUP_DETAILS_USERS_CHANGE,
  ACL_GROUP_DETAILS_USERS_ERROR,
  ACL_GROUP_CREATE_SUCCESS,
  ACL_GROUP_CREATE_ERROR,
  ACL_GROUP_UPDATE_SUCCESS,
  ACL_GROUP_UPDATE_ERROR,
  ACL_GROUP_DELETE_SUCCESS,
  ACL_GROUP_DELETE_ERROR,
  ACL_GROUP_USERS_CHANGED,
  ACL_GROUP_ADD_USER_ERROR,
  ACL_GROUP_REMOVE_USER_SUCCESS,
  ACL_GROUP_REMOVE_USER_ERROR
} from '../constants/EventTypes';

import ACLGroupsActions from '../actions/ACLGroupsActions';
import Group from '../structs/Group';

let SDK = require('../../../SDK').getSDK();

/**
* This store will keep track of groups and their details
*/
let ACLGroupStore = SDK.createStore({
  storeID: 'group',

  mixinEvents: {
    events: {
      success: ACL_GROUP_DETAILS_GROUP_CHANGE,
      error: ACL_GROUP_DETAILS_GROUP_ERROR,
      addUserSuccess: ACL_GROUP_USERS_CHANGED,
      addUserError: ACL_GROUP_ADD_USER_ERROR,
      createSuccess: ACL_GROUP_CREATE_SUCCESS,
      createError: ACL_GROUP_CREATE_ERROR,
      updateError: ACL_GROUP_UPDATE_ERROR,
      updateSuccess: ACL_GROUP_UPDATE_SUCCESS,
      permissionsSuccess: ACL_GROUP_DETAILS_PERMISSIONS_CHANGE,
      permissionsError: ACL_GROUP_DETAILS_PERMISSIONS_ERROR,
      usersSuccess: ACL_GROUP_DETAILS_USERS_CHANGE,
      usersError: ACL_GROUP_DETAILS_USERS_ERROR,
      fetchedDetailsSuccess: ACL_GROUP_DETAILS_FETCHED_SUCCESS,
      fetchedDetailsError: ACL_GROUP_DETAILS_FETCHED_ERROR,
      deleteUserSuccess: ACL_GROUP_REMOVE_USER_SUCCESS,
      deleteUserError: ACL_GROUP_REMOVE_USER_ERROR,
      deleteSuccess: ACL_GROUP_DELETE_SUCCESS,
      deleteError: ACL_GROUP_DELETE_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  get(prop) {
    return SDK.Store.getOwnState().groups[prop];
  },

  getGroupRaw: function (groupID) {
    return this.get('byId')[groupID];
  },

  getGroup: function (groupID) {
    return new Group(this.getGroupRaw(groupID));
  },

  setGroup: function (groupID, group) {
    let groups = this.get('byId');
    groups[groupID] = group;
    SDK.dispatch({
      type: ACL_GROUP_SET_GROUPS,
      groups
    });
  },

  fetchGroup: ACLGroupsActions.fetchGroup,

  addGroup: ACLGroupsActions.addGroup,

  updateGroup: ACLGroupsActions.updateGroup,

  deleteGroup: ACLGroupsActions.deleteGroup,

  addUser: ACLGroupsActions.addUser,

  deleteUser: ACLGroupsActions.deleteUser,

  /**
   * Will fetch a group and their details.
   * Will make a request to various different endpoints to get all details
   *
   * @param  {Number} groupID
   */
  fetchGroupWithDetails: function (groupID) {
    let groupsFetching = this.get('groupsFetching');

    groupsFetching[groupID] = {group: false, users: false, permissions: false};
    SDK.dispatch({
      type: ACL_GROUP_SET_GROUPS_FETCHING,
      groupsFetching
    });

    ACLGroupsActions.fetchGroup(groupID);
    ACLGroupsActions.fetchGroupPermissions(groupID);
    ACLGroupsActions.fetchGroupUsers(groupID);
  },

  /**
   * Validates if the details for a group have been successfuly fetched
   *
   * @param  {Number} groupID
   * @param  {String} type The type of detail that has been successfuly
   *   received
   */
  validateGroupWithDetailsFetch: function (groupID, type) {
    let groupsFetching = this.get('groupsFetching');
    if (groupsFetching[groupID] == null) {
      return;
    }

    groupsFetching[groupID][type] = true;

    let fetchedAll = true;
    Object.keys(groupsFetching[groupID]).forEach(function (key) {
      if (groupsFetching[groupID][key] === false) {
        fetchedAll = false;
      }
    });

    if (fetchedAll) {
      delete groupsFetching[groupID];
      SDK.dispatch({
        type: ACL_GROUP_SET_GROUPS_FETCHING,
        groupsFetching
      });
      this.emit(ACL_GROUP_DETAILS_FETCHED_SUCCESS, groupID);
    }
  },

  /**
   * Emits error if we're in the process of fetching details for a group
   * but one of the requests fails.
   *
   * @param  {Number} groupID
   */
  invalidateGroupWithDetailsFetch: function (groupID) {
    let groupsFetching = this.get('groupsFetching');
    if (groupsFetching[groupID] == null) {
      return;
    }

    delete groupsFetching[groupID];
    SDK.dispatch({
      type: ACL_GROUP_SET_GROUPS_FETCHING,
      groupsFetching
    });
    this.emit(ACL_GROUP_DETAILS_FETCHED_ERROR, groupID);
  },

  /**
   * Process a group response
   *
   * @param  {Object} groupData see /acl/groups/group schema
   */
  processGroup: function (groupData) {
    let group = this.getGroupRaw(groupData.gid) || {};

    group = _.extend(group, groupData);

    this.setGroup(group.gid, group);
    this.emit(ACL_GROUP_DETAILS_GROUP_CHANGE, group.gid);

    this.validateGroupWithDetailsFetch(group.gid, 'group');
  },

  processGroupError: function (data, groupID) {
    this.emit(
      ACL_GROUP_DETAILS_GROUP_ERROR,
      data,
      groupID);
    this.invalidateGroupWithDetailsFetch(groupID);
  },

  /**
   * Process a group permissions response
   *
   * @param  {Object} permissions see /acl/groups/group/permissions schema
   * @param  {Object} groupID
   */
  processGroupPermissions: function (permissions, groupID) {
    let group = this.getGroupRaw(groupID) || {};

    group.permissions = permissions;

    // Use groupID throughout as the group may not have been previously set
    this.setGroup(groupID, group);
    this.emit(ACL_GROUP_DETAILS_PERMISSIONS_CHANGE, groupID);

    this.validateGroupWithDetailsFetch(groupID, 'permissions');
  },

  processGroupPermissionsError: function (data, groupID) {
    this.emit(
      ACL_GROUP_DETAILS_PERMISSIONS_ERROR,
      data,
      groupID);
    this.invalidateGroupWithDetailsFetch(groupID);
  },

  /**
   * Process a grup users response
   *
   * @param  {Object} users see /acl/groups/group/users schema
   * @param  {Object} groupID
   */
  processGroupUsers: function (users, groupID) {
    let group = this.getGroupRaw(groupID) || {};

    group.users = users;

    // Use groupID throughout as the group may not have been previously set
    this.setGroup(groupID, group);
    this.emit(ACL_GROUP_DETAILS_USERS_CHANGE, groupID);

    this.validateGroupWithDetailsFetch(groupID, 'users');
  },

  processGroupUsersError: function (data, groupID) {
    this.emit(
      ACL_GROUP_DETAILS_USERS_ERROR,
      data,
      groupID);
    this.invalidateGroupWithDetailsFetch(groupID);
  }
});

SDK.onDispatch(function (action) {
  switch (action.type) {
    // Get group details
    case REQUEST_ACL_GROUP_SUCCESS:
      ACLGroupStore.processGroup(action.data);
      break;
    case REQUEST_ACL_GROUP_ERROR:
      ACLGroupStore.processGroupError(action.data, action.groupID);
      break;
    // Get ACL permissions of group
    case REQUEST_ACL_GROUP_PERMISSIONS_SUCCESS:
      ACLGroupStore.processGroupPermissions(action.data, action.groupID);
      break;
    case REQUEST_ACL_GROUP_PERMISSIONS_ERROR:
      ACLGroupStore.processGroupPermissionsError(
        action.data,
        action.groupID);
      break;
    // Get users members of group
    case REQUEST_ACL_GROUP_USERS_SUCCESS:
      ACLGroupStore.processGroupUsers(action.data, action.groupID);
      break;
    case REQUEST_ACL_GROUP_USERS_ERROR:
      ACLGroupStore.processGroupUsersError(action.data, action.groupID);
      break;
    // Create group
    case REQUEST_ACL_GROUP_CREATE_SUCCESS:
      ACLGroupStore.emit(ACL_GROUP_CREATE_SUCCESS, action.groupID);
      break;
    case REQUEST_ACL_GROUP_CREATE_ERROR:
      ACLGroupStore.emit(
        ACL_GROUP_CREATE_ERROR,
        action.data,
        action.groupID
      );
      break;
    // Update group
    case REQUEST_ACL_GROUP_UPDATE_SUCCESS:
      ACLGroupStore.emit(ACL_GROUP_UPDATE_SUCCESS, action.groupID);
      break;
    case REQUEST_ACL_GROUP_UPDATE_ERROR:
      ACLGroupStore.emit(
        ACL_GROUP_UPDATE_ERROR,
        action.data,
        action.groupID
      );
      break;
    // Delete group
    case REQUEST_ACL_GROUP_DELETE_SUCCESS:
      ACLGroupStore.emit(ACL_GROUP_DELETE_SUCCESS, action.groupID);
      break;
    case REQUEST_ACL_GROUP_DELETE_ERROR:
      ACLGroupStore.emit(
        ACL_GROUP_DELETE_ERROR,
        action.data,
        action.groupID
      );
      break;
    // Add user to group
    case REQUEST_ACL_GROUP_ADD_USER_SUCCESS:
      ACLGroupStore.emit(
        ACL_GROUP_USERS_CHANGED,
        action.groupID,
        action.userID
      );
      break;
    case REQUEST_ACL_GROUP_ADD_USER_ERROR:
      ACLGroupStore.emit(
        ACL_GROUP_ADD_USER_ERROR,
        action.data,
        action.groupID,
        action.userID
      );
      break;
    // Remove user from group
    case REQUEST_ACL_GROUP_REMOVE_USER_SUCCESS:
      ACLGroupStore.emit(
        ACL_GROUP_REMOVE_USER_SUCCESS,
        action.groupID,
        action.userID
      );
      break;
    case REQUEST_ACL_GROUP_REMOVE_USER_ERROR:
      ACLGroupStore.emit(
        ACL_GROUP_REMOVE_USER_ERROR,
        action.data,
        action.groupID,
        action.userID
      );
      break;
  }
});

module.exports = ACLGroupStore;
