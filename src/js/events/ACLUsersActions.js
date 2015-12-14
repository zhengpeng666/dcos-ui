import _ from "underscore";

import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "./AppDispatcher";
import Config from "../config/Config";
import RequestUtil from "../utils/RequestUtil";

const ACLUsersActions = {

  fetch: function () {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/users`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USERS_SUCCESS,
          data: response.array
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USERS_ERROR,
          data: e.responseJSON.error
        });
      }
    });
  },

  fetchUser: function (userID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/users/${userID}`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_SUCCESS,
          data: response
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_ERROR,
          data: e.responseJSON.error,
          userID
        });
      }
    });
  },

  fetchUserGroups: function (userID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/users/${userID}/groups`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_GROUPS_SUCCESS,
          data: response.array,
          userID
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_GROUPS_ERROR,
          data: e.responseJSON.error,
          userID
        });
      }
    });
  },

  fetchUserPermissions: function (userID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/users/${userID}/permissions`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_PERMISSIONS_SUCCESS,
          data: response,
          userID
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_PERMISSIONS_ERROR,
          data: e.responseJSON.error,
          userID
        });
      }
    });
  },

  addUser: function (data) {
    let userID = data.uid;
    data = _.omit(data, "uid");

    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/users/${userID}`,
      type: "PUT",
      data,
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_CREATE_SUCCESS,
          userID
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_CREATE_ERROR,
          data: e.responseJSON.error,
          userID
        });
      }
    });
  },

  updateUser: function (userID, patchData) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/users/${userID}`,
      type: "PATCH",
      patchData,
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_UPDATE_SUCCESS,
          userID
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_UPDATE_ERROR,
          data: e.responseJSON.error,
          userID
        });
      }
    });
  },

  deleteUser: function (userID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/users/${userID}`,
      type: "DELETE",
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_DELETE_SUCCESS,
          userID
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_DELETE_ERROR,
          data: e.responseJSON.error,
          userID
        });
      }
    });
  }

};

if (Config.useFixtures) {
  let userFixture = require("json!../../../tests/_fixtures/acl/user-unicode.json");
  let usersFixture = require("json!../../../tests/_fixtures/acl/users-unicode.json");
  let userDetailsFixture =
    require("json!../../../tests/_fixtures/acl/user-with-details.json");

  if (!global.actionTypes) {
    global.actionTypes = {};
  }

  global.actionTypes.ACLUsersActions = {
    fetch: {event: "success", success: {response: usersFixture}},
    fetchUser: {event: "success", success: {response: userFixture}},
    fetchUserGroups: {event: "success", success: {
      response: userDetailsFixture.groups
    }},
    fetchUserPermissions: {event: "success", success: {
      response: userDetailsFixture.permissions
    }},
    addUser: {event: "success"},
    updateUser: {event: "success"},
    deleteUser: {event: "success"}
  };

  Object.keys(global.actionTypes.ACLUsersActions).forEach(function (method) {
    ACLUsersActions[method] = RequestUtil.stubRequest(
      ACLUsersActions, "ACLUsersActions", method
    );
  });
}

export default ACLUsersActions;
