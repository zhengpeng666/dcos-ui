import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "./AppDispatcher";
import Config from "../config/Config";
import RequestUtil from "../utils/RequestUtil";

const ACLGroupDetailActions = {

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
          data: e.message
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
          data: e.message,
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
          data: e.message,
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
          data: e.message,
          groupID
        });
      }
    });
  }

};

if (Config.useFixtures) {
  let groupFixture = require("json!../../../tests/_fixtures/acl/group-unicode.json");
  let groupDetailsFixture = require("json!../../../tests/_fixtures/acl/group-with-details.json");

  ACLGroupsActions.fetch = function () {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_GROUPS_SUCCESS,
      data: groupsFixture
    });
  };
  ACLGroupDetailActions.fetchGroup = function () {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_GROUP_SUCCESS,
      data: groupFixture
    });
  };
  ACLGroupDetailActions.fetchGroupPermissions = function () {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_GROUP_PERMISSIONS_SUCCESS,
      data: groupDetailsFixture.permissions,
      groupID: groupFixture.gid
    });
  };
  ACLGroupDetailActions.fetchGroupUsers = function () {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_GROUP_USERS_SUCCESS,
      data: groupDetailsFixture.users,
      groupID: groupFixture.gid
    });
  };
}

export default ACLGroupDetailActions;
