var ActionTypes = require("../constants/ActionTypes");
var AppDispatcher = require("./AppDispatcher");
var Config = require("../config/Config");
var RequestUtil = require("../utils/RequestUtil");

var UserActions = {

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
  let userFixture = require("../../../tests/_fixtures/acl/user-unicode.json");
  let userDetailsFixture =
    require("../../../tests/_fixtures/acl/user-with-details.json");

  UserActions.fetchUser = function () {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_USER_SUCCESS,
      data: userFixture
    });
  };

  UserActions.fetchUserGroups = function () {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_USER_GROUPS_SUCCESS,
      data: userDetailsFixture.groups,
      userID: userFixture.uid
    });
  };

  UserActions.fetchUserPermissions = function () {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_USER_PERMISSIONS_SUCCESS,
      data: userDetailsFixture.permissions,
      userID: userFixture.uid
    });
  };
}

module.exports = UserActions;
