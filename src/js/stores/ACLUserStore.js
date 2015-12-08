import _ from "underscore";

import ACLUsersActions from "../events/ACLUsersActions";
import AppDispatcher from "../events/AppDispatcher";
import ActionTypes from "../constants/ActionTypes";
import EventTypes from "../constants/EventTypes";
import GetSetMixin from "../mixins/GetSetMixin";
import User from "../structs/User";
import Store from "../utils/Store";

/**
 * This store will keep track of users and their details
 */
var ACLUserStore = Store.createStore({
  storeID: "user",

  mixins: [GetSetMixin],

  getSet_data: {
    users: {},
    // A hash of userIds that we're fetching
    // The value is a list of requests that have been received
    usersFetching: {}
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  getUserRaw: function (userID) {
    return this.get("users")[userID];
  },

  getUser: function (userID) {
    return new User(this.getUserRaw(userID) || {});
  },

  setUser: function (userID, user) {
    let users = this.get("users");
    users[userID] = user;
    this.set({users});
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
    let usersFetching = this.get("usersFetching");

    usersFetching[userID] = {user: false, groups: false, permissions: false};
    this.set({usersFetching});

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
    let usersFetching = this.get("usersFetching");
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
      this.set({usersFetching});
      this.emit(EventTypes.ACL_USER_DETAILS_FETCHED_SUCCESS, userID);
    }
  },

  /**
   * Emits error if we're in the process of fetching details for a user
   * but one of the requests fails.
   *
   * @param  {Number} userID
   */
  invalidateUserWithDetailsFetch: function (userID) {
    let usersFetching = this.get("usersFetching");
    if (usersFetching[userID] == null) {
      return;
    }

    delete usersFetching[userID];
    this.set({usersFetching});
    this.emit(EventTypes.ACL_USER_DETAILS_FETCHED_ERROR, userID);
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
    this.emit(EventTypes.ACL_USER_DETAILS_USER_CHANGE, user.uid);

    this.validateUserWithDetailsFetch(user.uid, "user");
  },

  processUserError: function (userID) {
    this.emit(EventTypes.ACL_USER_DETAILS_USER_ERROR, userID);
    this.invalidateUserWithDetailsFetch(userID);
  },

  /**
   * Process a user groups response
   *
   * @param  {Object} userID
   * @param  {Object} groups see /acl/users/user/groups schema
   */
  processUserGroups: function (userID, groups) {
    let user = this.getUserRaw(userID) || {};

    user.groups = groups;

    // Use userID throughout as the user may not have been previously set
    this.setUser(userID, user);
    this.emit(EventTypes.ACL_USER_DETAILS_GROUPS_CHANGE, userID);

    this.validateUserWithDetailsFetch(userID, "groups");
  },

  processUserGroupsError: function (userID) {
    this.emit(EventTypes.ACL_USER_DETAILS_GROUPS_ERROR, userID);
    this.invalidateUserWithDetailsFetch(userID);
  },

  /**
   * Process a user permissions response
   *
   * @param  {Object} userID
   * @param  {Object} permissions see /acl/users/user/permissions schema
   */
  processUserPermissions: function (userID, permissions) {
    let user = this.getUserRaw(userID) || {};

    user.permissions = permissions;

    // Use userID throughout as the user may not have been previously set
    this.setUser(userID, user);
    this.emit(EventTypes.ACL_USER_DETAILS_PERMISSIONS_CHANGE, userID);

    this.validateUserWithDetailsFetch(userID, "permissions");
  },

  processUserPermissionsError: function (userID) {
    this.emit(EventTypes.ACL_USER_DETAILS_PERMISSIONS_ERROR, userID);
    this.invalidateUserWithDetailsFetch(userID);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    if (payload.source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    var action = payload.action;
    switch (action.type) {
      case ActionTypes.REQUEST_ACL_USER_SUCCESS:
        ACLUserStore.processUser(action.data);
        break;
      case ActionTypes.REQUEST_ACL_USER_ERROR:
        ACLUserStore.processUserError(action.userID);
        break;
      case ActionTypes.REQUEST_ACL_USER_GROUPS_SUCCESS:
        ACLUserStore.processUserGroups(action.userID, action.data);
        break;
      case ActionTypes.REQUEST_ACL_USER_GROUPS_ERROR:
        ACLUserStore.processUserGroupsError(action.userID);
        break;
      case ActionTypes.REQUEST_ACL_USER_PERMISSIONS_SUCCESS:
        ACLUserStore.processUserPermissions(action.userID, action.data);
        break;
      case ActionTypes.REQUEST_ACL_USER_PERMISSIONS_ERROR:
        ACLUserStore.processUserPermissionsError(action.userID);
        break;
      case ActionTypes.REQUEST_ACL_USER_CREATE_SUCCESS:
        ACLUserStore.emit(EventTypes.ACL_USER_CREATE_SUCCESS, action.userID);
        break;
      case ActionTypes.REQUEST_ACL_USER_CREATE_ERROR:
        ACLUserStore.emit(
          EventTypes.ACL_USER_CREATE_ERROR, action.data, action.userID
        );
        break;
      case ActionTypes.REQUEST_ACL_USER_UPDATE_SUCCESS:
        ACLUserStore
          .emit(EventTypes.ACL_USER_UPDATE_SUCCESS, action.userID);
        break;
      case ActionTypes.REQUEST_ACL_USER_UPDATE_ERROR:
        ACLUserStore.emit(EventTypes.ACL_USER_UPDATE_ERROR, action.userID);
        break;
      case ActionTypes.REQUEST_ACL_USER_DELETE_SUCCESS:
        ACLUserStore
          .emit(EventTypes.ACL_USER_DELETE_SUCCESS, action.userID);
        break;
      case ActionTypes.REQUEST_ACL_USER_DELETE_ERROR:
        ACLUserStore.emit(EventTypes.ACL_USER_DELETE_ERROR, action.userID, action.data);
        break;
    }

    return true;
  })

});

module.exports = ACLUserStore;
