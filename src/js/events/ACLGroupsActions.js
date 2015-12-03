import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "./AppDispatcher";
import Config from "../config/Config";
import RequestUtil from "../utils/RequestUtil";

const ACLGroupsActions = {

  fetch: function () {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/groups`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUPS_SUCCESS,
          data: response
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUPS_ERROR,
          data: e.error
        });
      }
    });
  },

  fetchGroup: function (groupID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/groups/${groupID}`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_SUCCESS,
          data: response
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_ERROR,
          data: e.error,
          groupID
        });
      }
    });
  },

  fetchGroupPermissions: function (groupID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/groups/${groupID}/permissions`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_PERMISSIONS_SUCCESS,
          data: response,
          groupID
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_PERMISSIONS_ERROR,
          data: e.error,
          groupID
        });
      }
    });
  },

  fetchGroupUsers: function (groupID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/groups/${groupID}/users`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_USERS_SUCCESS,
          data: response,
          groupID
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_USERS_ERROR,
          data: e.error,
          groupID
        });
      }
    });
  },

  addUser: function (groupID, userID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/groups/${groupID}/users/${userID}`,
      type: "PUT",
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_ADD_USER_SUCCESS,
          data: response,
          groupID,
          userID
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_ADD_USER_ERROR,
          data: e.error,
          groupID,
          userID
        });
      }
    });
  },

  removeUser: function (groupID, userID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/groups/${groupID}/users/${userID}`,
      type: "DELETE",
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_REMOVE_USER_SUCCESS,
          data: response,
          groupID,
          userID
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_REMOVE_USER_ERROR,
          data: e.error,
          groupID,
          userID
        });
      }
    });
  }
};

if (Config.useFixtures) {
  let groupFixture = require("json!../../../tests/_fixtures/acl/group-unicode.json");
  let groupDetailsFixture = require("json!../../../tests/_fixtures/acl/group-with-details.json");
  let groupsFixture = require("json!../../../tests/_fixtures/acl/groups-unicode.json");

  ACLGroupsActions.fetch = function () {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_GROUPS_SUCCESS,
      data: groupsFixture
    });
  };
  ACLGroupsActions.fetchGroup = function () {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_GROUP_SUCCESS,
      data: groupFixture
    });
  };
  ACLGroupsActions.fetchGroupPermissions = function () {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_GROUP_PERMISSIONS_SUCCESS,
      data: groupDetailsFixture.permissions,
      groupID: groupFixture.gid
    });
  };
  ACLGroupsActions.fetchGroupUsers = function () {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_GROUP_USERS_SUCCESS,
      data: groupDetailsFixture.users,
      groupID: groupFixture.gid
    });
  };
  ACLGroupsActions.addUser = function (groupID, userID) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_GROUP_ADD_USER_SUCCESS,
      data: groupDetailsFixture.permissions,
      groupID,
      userID
    });
  };
  ACLGroupsActions.deleteUser = function (groupID, userID) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_GROUP_REMOVE_USER_SUCCESS,
      data: groupDetailsFixture.users,
      groupID,
      userID
    });
  };
}

export default ACLGroupsActions;
