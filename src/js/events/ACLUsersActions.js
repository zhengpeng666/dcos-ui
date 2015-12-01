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
          data: response
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USERS_ERROR,
          data: e.message
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
          data: e.message,
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
          data: response,
          userID
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_GROUPS_ERROR,
          data: e.message,
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
          data: e.message,
          userID
        });
      }
    });
  },

  addUser: function (data) {
    let userID = data.uid;
    delete data.uid;

    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/users/${userID}`,
      type: "PUT",
      data,
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_CREATE_SUCCESS
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_CREATE_ERROR,
          data: e.message
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
          data: e.message,
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
          data: e.message,
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

  ACLUsersActions.fetch = function () {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_USERS_SUCCESS,
      data: usersFixture
    });
  };

  ACLUsersActions.fetchUser = function () {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_USER_SUCCESS,
      data: userFixture
    });
  };

  ACLUsersActions.fetchUserGroups = function () {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_USER_GROUPS_SUCCESS,
      data: userDetailsFixture.groups,
      userID: userFixture.uid
    });
  };

  ACLUsersActions.fetchUserPermissions = function () {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_USER_PERMISSIONS_SUCCESS,
      data: userDetailsFixture.permissions,
      userID: userFixture.uid
    });
  };

  ACLUsersActions.addUser = function () {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_USER_CREATE_SUCCESS
    });
  };

  ACLUsersActions.updateUser = function (userID) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_USER_UPDATE_SUCCESS,
      userID
    });
  };

  ACLUsersActions.deleteUser = function (userID) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_USER_DELETE_SUCCESS,
      userID
    });
  };
}

export default ACLUsersActions;
