import _ from 'underscore';

import {
  REQUEST_ACL_USER_SUCCESS,
  REQUEST_ACL_USER_ERROR,
  REQUEST_ACL_USER_GROUPS_SUCCESS,
  REQUEST_ACL_USER_GROUPS_ERROR,
  REQUEST_ACL_USER_PERMISSIONS_SUCCESS,
  REQUEST_ACL_USER_PERMISSIONS_ERROR,
  REQUEST_ACL_USER_CREATE_SUCCESS,
  REQUEST_ACL_USER_CREATE_ERROR,
  REQUEST_ACL_USER_UPDATE_SUCCESS,
  REQUEST_ACL_USER_UPDATE_ERROR,
  REQUEST_ACL_USER_DELETE_SUCCESS,
  REQUEST_ACL_USER_DELETE_ERROR
} from '../constants/ActionTypes';

import {
  ACL_USER_DETAILS_FETCH_START,
  ACL_USER_DETAILS_FETCHED_SUCCESS,
  ACL_USER_DETAILS_FETCHED_ERROR,
  ACL_USER_DETAILS_USER_CHANGE,
  ACL_USER_DETAILS_USER_ERROR,
  ACL_USER_DETAILS_GROUPS_CHANGE,
  ACL_USER_DETAILS_GROUPS_ERROR,
  ACL_USER_DETAILS_PERMISSIONS_CHANGE,
  ACL_USER_DETAILS_PERMISSIONS_ERROR,
  ACL_USER_CREATE_SUCCESS,
  ACL_USER_CREATE_ERROR,
  ACL_USER_SET_USER,
  ACL_USER_UPDATE_SUCCESS,
  ACL_USER_UPDATE_ERROR,
  ACL_USER_DELETE_SUCCESS,
  ACL_USER_DELETE_ERROR,
} from '../constants/EventTypes';

import ACLUsersActions from '../actions/ACLUsersActions';
import User from '../structs/User';

let SDK = require('../../../SDK').getSDK();

/**
 * This store will keep track of users and their details
 */
var ACLUserStore = SDK.createStore({
  storeID: 'user',

  mixinEvents: {
    events: {
      success: ACL_USER_DETAILS_USER_CHANGE,
      error: ACL_USER_DETAILS_USER_ERROR,
      permissionsSuccess: ACL_USER_DETAILS_PERMISSIONS_CHANGE,
      permissionsError: ACL_USER_DETAILS_PERMISSIONS_ERROR,
      groupsSuccess: ACL_USER_DETAILS_GROUPS_CHANGE,
      groupsError: ACL_USER_DETAILS_GROUPS_ERROR,
      fetchedDetailsSuccess: ACL_USER_DETAILS_FETCHED_SUCCESS,
      fetchedDetailsError: ACL_USER_DETAILS_FETCHED_ERROR,
      createSuccess: ACL_USER_CREATE_SUCCESS,
      createError: ACL_USER_CREATE_ERROR,
      updateSuccess: ACL_USER_UPDATE_SUCCESS,
      updateError: ACL_USER_UPDATE_ERROR,
      deleteSuccess: ACL_USER_DELETE_SUCCESS,
      deleteError: ACL_USER_DELETE_ERROR
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  get(prop) {
    return SDK.Store.getOwnState().users[prop];
  },

  getUserRaw: function (userID) {
    return this.get('byId')[userID];
  },

  getUser: function (userID) {
    return new User(this.getUserRaw(userID) || {});
  },

  setUser: function (userID, user) {
    let users = this.get('byId');
    users[userID] = user;
    SDK.dispatch({
      type: ACL_USER_SET_USER,
      users
    });
  },

  fetchUser: ACLUsersActions.fetchUser,

  addUser: ACLUsersActions.addUser,

  updateUser: ACLUsersActions.updateUser,

  deleteUser: ACLUsersActions.deleteUser,

  /**
   * Will fetch a user and their details.
   * Will make a request to various different endpoints to get all details
   *
   * @param  {Number} userID
   */
  fetchUserWithDetails: function (userID) {
    let usersFetching = this.get('usersFetching');

    usersFetching[userID] = {user: false, groups: false, permissions: false};
    SDK.dispatch({
      type: ACL_USER_DETAILS_FETCH_START,
      usersFetching
    });

    ACLUsersActions.fetchUser(userID);
    ACLUsersActions.fetchUserGroups(userID);
    ACLUsersActions.fetchUserPermissions(userID);
  },

  /**
   * Validates if the details for a user have been successfuly fetched
   *
   * @param  {Number} userID
   * @param  {String} type The type of detail that has been successfuly
   *   received
   */
  validateUserWithDetailsFetch: function (userID, type) {
    let usersFetching = this.get('usersFetching');
    if (usersFetching[userID] == null) {
      return;
    }

    usersFetching[userID][type] = true;

    let fetchedAll = true;
    Object.keys(usersFetching[userID]).forEach(function (key) {
      if (usersFetching[userID][key] === false) {
        fetchedAll = false;
      }
    });

    if (fetchedAll === true) {
      delete usersFetching[userID];
      SDK.dispatch({
        type: ACL_USER_DETAILS_FETCHED_SUCCESS,
        usersFetching
      });
      this.emit(ACL_USER_DETAILS_FETCHED_SUCCESS, userID);
    }
  },

  /**
   * Emits error if we're in the process of fetching details for a user
   * but one of the requests fails.
   *
   * @param  {Number} userID
   */
  invalidateUserWithDetailsFetch: function (userID) {
    let usersFetching = this.get('usersFetching');
    if (usersFetching[userID] == null) {
      return;
    }

    delete usersFetching[userID];
    SDK.dispatch({
      type: ACL_USER_DETAILS_FETCHED_ERROR,
      usersFetching
    });
    this.emit(ACL_USER_DETAILS_FETCHED_ERROR, userID);
  },

  /**
   * Process a user response
   *
   * @param  {Object} userData see /acl/users/user schema
   */
  processUser: function (userData) {
    let user = this.getUserRaw(userData.uid) || {};

    user = _.extend(user, userData);

    this.setUser(user.uid, user);
    this.emit(ACL_USER_DETAILS_USER_CHANGE, user.uid);

    this.validateUserWithDetailsFetch(user.uid, 'user');
  },

  processUserError: function (userID) {
    this.emit(ACL_USER_DETAILS_USER_ERROR, userID);
    this.invalidateUserWithDetailsFetch(userID);
  },

  /**
   * Process a user groups response
   *
   * @param  {Object} groups see /acl/users/user/groups schema
   * @param  {Object} userID
   */
  processUserGroups: function (groups, userID) {
    let user = this.getUserRaw(userID) || {};

    user.groups = groups;

    // Use userID throughout as the user may not have been previously set
    this.setUser(userID, user);
    this.emit(ACL_USER_DETAILS_GROUPS_CHANGE, userID);

    this.validateUserWithDetailsFetch(userID, 'groups');
  },

  processUserGroupsError: function (userID) {
    this.emit(ACL_USER_DETAILS_GROUPS_ERROR, userID);
    this.invalidateUserWithDetailsFetch(userID);
  },

  /**
   * Process a user permissions response
   *
   * @param  {Object} permissions see /acl/users/user/permissions schema
   * @param  {Object} userID
   */
  processUserPermissions: function (permissions, userID) {
    let user = this.getUserRaw(userID) || {};

    user.permissions = permissions;

    // Use userID throughout as the user may not have been previously set
    this.setUser(userID, user);
    this.emit(ACL_USER_DETAILS_PERMISSIONS_CHANGE, userID);

    this.validateUserWithDetailsFetch(userID, 'permissions');
  },

  processUserPermissionsError: function (userID) {
    this.emit(ACL_USER_DETAILS_PERMISSIONS_ERROR, userID);
    this.invalidateUserWithDetailsFetch(userID);
  }
});

SDK.onDispatch(function (action) {
  switch (action.type) {
    // Get user details
    case REQUEST_ACL_USER_SUCCESS:
      ACLUserStore.processUser(action.data);
      break;
    case REQUEST_ACL_USER_ERROR:
      ACLUserStore.processUserError(action.userID);
      break;
    // Get groups for user
    case REQUEST_ACL_USER_GROUPS_SUCCESS:
      ACLUserStore.processUserGroups(action.data, action.userID);
      break;
    case REQUEST_ACL_USER_GROUPS_ERROR:
      ACLUserStore.processUserGroupsError(action.userID);
      break;
    // Get ACLs for user
    case REQUEST_ACL_USER_PERMISSIONS_SUCCESS:
      ACLUserStore.processUserPermissions(action.data, action.userID);
      break;
    case REQUEST_ACL_USER_PERMISSIONS_ERROR:
      ACLUserStore.processUserPermissionsError(action.userID);
      break;
    // Create user
    case REQUEST_ACL_USER_CREATE_SUCCESS:
      ACLUserStore.emit(ACL_USER_CREATE_SUCCESS, action.userID);
      break;
    case REQUEST_ACL_USER_CREATE_ERROR:
      ACLUserStore.emit(
        ACL_USER_CREATE_ERROR, action.data, action.userID
      );
      break;
    // Update user
    case REQUEST_ACL_USER_UPDATE_SUCCESS:
      ACLUserStore.emit(ACL_USER_UPDATE_SUCCESS, action.userID);
      break;
    case REQUEST_ACL_USER_UPDATE_ERROR:
      ACLUserStore.emit(
        ACL_USER_UPDATE_ERROR,
        action.data,
        action.userID
      );
      break;
    // Delete user
    case REQUEST_ACL_USER_DELETE_SUCCESS:
      ACLUserStore.emit(ACL_USER_DELETE_SUCCESS, action.userID);
      break;
    case REQUEST_ACL_USER_DELETE_ERROR:
      ACLUserStore.emit(
        ACL_USER_DELETE_ERROR,
        action.data,
        action.userID
      );
      break;
  }
});

module.exports = ACLUserStore;
