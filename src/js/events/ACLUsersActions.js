import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "./AppDispatcher";
import Config from "../config/Config";
import RequestUtil from "../utils/RequestUtil";

var ACLUsersActions = {

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
  }

};

if (Config.useFixtures) {
  let userFixture = require("json!../../../tests/_fixtures/acl/user-unicode.json");
  let userDetailsFixture =
    require("json!../../../tests/_fixtures/acl/user-with-details.json");

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
}

module.exports = ACLUsersActions;
