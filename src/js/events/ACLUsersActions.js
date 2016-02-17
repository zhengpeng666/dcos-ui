import _ from 'underscore';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from './AppDispatcher';
import Config from '../config/Config';
import RequestUtil from '../utils/RequestUtil';

const ACLUsersActions = {
  fetch: function () {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/users`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USERS_SUCCESS,
          data: response.array
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USERS_ERROR,
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
          type: ActionTypes.REQUEST_ACL_USER_SUCCESS,
          data: response
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_ERROR,
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
          type: ActionTypes.REQUEST_ACL_USER_GROUPS_SUCCESS,
          data: response.array,
          userID
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_GROUPS_ERROR,
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
          type: ActionTypes.REQUEST_ACL_USER_PERMISSIONS_SUCCESS,
          data: response,
          userID
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_PERMISSIONS_ERROR,
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
          type: ActionTypes.REQUEST_ACL_USER_CREATE_SUCCESS,
          userID
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_CREATE_ERROR,
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
          type: ActionTypes.REQUEST_ACL_USER_UPDATE_SUCCESS,
          userID
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_UPDATE_ERROR,
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
          type: ActionTypes.REQUEST_ACL_USER_DELETE_SUCCESS,
          userID
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_DELETE_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          userID
        });
      }
    });
  }
};

if (Config.useFixtures) {
  let userFixture = require('json!../../../tests/_fixtures/acl/user-unicode.json');
  let usersFixture = require('json!../../../tests/_fixtures/acl/users-unicode.json');
  let userDetailsFixture =
    require('json!../../../tests/_fixtures/acl/user-with-details.json');

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

module.exports = ACLUsersActions;
