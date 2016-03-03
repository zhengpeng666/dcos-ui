import _ from 'underscore';
import Config from 'Config';

import {
  REQUEST_ACL_USERS_SUCCESS,
  REQUEST_ACL_USERS_ERROR,
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

import AppDispatcher from '../../../../../src/js/events/AppDispatcher';

let cached;

module.exports = (PluginSDK) => {
  if (cached) {
    return cached;
  }

  let RequestUtil = PluginSDK.get('RequestUtil');

  const ACLUsersActions = {
    fetch: function () {
      RequestUtil.json({
        url: `${Config.rootUrl}${Config.acsAPIPrefix}/users`,
        success: function (response) {
          AppDispatcher.handleServerAction({
            type: REQUEST_ACL_USERS_SUCCESS,
            data: response.array
          });
        },
        error: function (xhr) {
          AppDispatcher.handleServerAction({
            type: REQUEST_ACL_USERS_ERROR,
            data: RequestUtil.getErrorFromXHR(xhr)
          });
        }
      });
    },

    fetchUser: function (userID) {
      RequestUtil.json({
        url: `${Config.rootUrl}${Config.acsAPIPrefix}/users/${userID}`,
        success: function (response) {
          AppDispatcher.handleServerAction({
            type: REQUEST_ACL_USER_SUCCESS,
            data: response
          });
        },
        error: function (xhr) {
          AppDispatcher.handleServerAction({
            type: REQUEST_ACL_USER_ERROR,
            data: RequestUtil.getErrorFromXHR(xhr),
            userID
          });
        }
      });
    },

    fetchUserGroups: function (userID) {
      RequestUtil.json({
        url: `${Config.rootUrl}${Config.acsAPIPrefix}/users/${userID}/groups`,
        success: function (response) {
          AppDispatcher.handleServerAction({
            type: REQUEST_ACL_USER_GROUPS_SUCCESS,
            data: response.array,
            userID
          });
        },
        error: function (xhr) {
          AppDispatcher.handleServerAction({
            type: REQUEST_ACL_USER_GROUPS_ERROR,
            data: RequestUtil.getErrorFromXHR(xhr),
            userID
          });
        }
      });
    },

    fetchUserPermissions: function (userID) {
      RequestUtil.json({
        url: `${Config.rootUrl}${Config.acsAPIPrefix}/users/${userID}/permissions`,
        success: function (response) {
          AppDispatcher.handleServerAction({
            type: REQUEST_ACL_USER_PERMISSIONS_SUCCESS,
            data: response,
            userID
          });
        },
        error: function (xhr) {
          AppDispatcher.handleServerAction({
            type: REQUEST_ACL_USER_PERMISSIONS_ERROR,
            data: RequestUtil.getErrorFromXHR(xhr),
            userID
          });
        }
      });
    },

    addUser: function (data) {
      let userID = data.uid;
      data = _.omit(data, 'uid');

      if (!userID && data.description) {
        userID = data.description.replace(/\s+/g, '').toLowerCase();
      }

      RequestUtil.json({
        url: `${Config.rootUrl}${Config.acsAPIPrefix}/users/${userID}`,
        method: 'PUT',
        data,
        success: function () {
          AppDispatcher.handleServerAction({
            type: REQUEST_ACL_USER_CREATE_SUCCESS,
            userID
          });
        },
        error: function (xhr) {
          AppDispatcher.handleServerAction({
            type: REQUEST_ACL_USER_CREATE_ERROR,
            data: RequestUtil.getErrorFromXHR(xhr),
            userID
          });
        }
      });
    },

    updateUser: function (userID, patchData) {
      RequestUtil.json({
        url: `${Config.rootUrl}${Config.acsAPIPrefix}/users/${userID}`,
        method: 'PATCH',
        data: patchData,
        success: function () {
          AppDispatcher.handleServerAction({
            type: REQUEST_ACL_USER_UPDATE_SUCCESS,
            userID
          });
        },
        error: function (xhr) {
          AppDispatcher.handleServerAction({
            type: REQUEST_ACL_USER_UPDATE_ERROR,
            data: RequestUtil.getErrorFromXHR(xhr),
            userID
          });
        }
      });
    },

    deleteUser: function (userID) {
      RequestUtil.json({
        url: `${Config.rootUrl}${Config.acsAPIPrefix}/users/${userID}`,
        method: 'DELETE',
        success: function () {
          AppDispatcher.handleServerAction({
            type: REQUEST_ACL_USER_DELETE_SUCCESS,
            userID
          });
        },
        error: function (xhr) {
          AppDispatcher.handleServerAction({
            type: REQUEST_ACL_USER_DELETE_ERROR,
            data: RequestUtil.getErrorFromXHR(xhr),
            userID
          });
        }
      });
    }
  };

  if (Config.useFixtures) {
    let userFixture = require('../../../../../tests/_fixtures/acl/user-unicode.json');
    let usersFixture = require('../../../../../tests/_fixtures/acl/users-unicode.json');
    let userDetailsFixture =
      require('../../../../../tests/_fixtures/acl/user-with-details.json');

    if (!global.actionTypes) {
      global.actionTypes = {};
    }

    global.actionTypes.ACLUsersActions = {
      fetch: {event: 'success', success: {response: usersFixture}},
      fetchUser: {event: 'success', success: {response: userFixture}},
      fetchUserGroups: {event: 'success', success: {
        response: userDetailsFixture.groups
      }},
      fetchUserPermissions: {event: 'success', success: {
        response: userDetailsFixture.permissions
      }},
      addUser: {event: 'success'},
      updateUser: {event: 'success'},
      deleteUser: {event: 'success'}
    };

    Object.keys(global.actionTypes.ACLUsersActions).forEach(function (method) {
      ACLUsersActions[method] = RequestUtil.stubRequest(
        ACLUsersActions, 'ACLUsersActions', method
      );
    });
  }
  cached = ACLUsersActions;

  return ACLUsersActions;
};

