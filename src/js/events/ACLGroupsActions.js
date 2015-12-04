import _ from "underscore";

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

  addGroup: function (data) {
    let groupID = data.gid;
    data = _.omit(data, "gid");

    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/groups/${groupID}`,
      type: "PUT",
      data,
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_CREATE_SUCCESS,
          groupID
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_CREATE_ERROR,
          data: e.error,
          groupID
        });
      }
    });
  },

  updateGroup: function (groupID, patchData) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/groups/${groupID}`,
      type: "PATCH",
      patchData,
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_UPDATE_SUCCESS,
          groupID
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_UPDATE_ERROR,
          data: e.error,
          groupID
        });
      }
    });
  },

  deleteGroup: function (groupID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/groups/${groupID}`,
      type: "DELETE",
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_DELETE_SUCCESS,
          groupID
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_DELETE_ERROR,
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
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_ADD_USER_SUCCESS,
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
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_REMOVE_USER_SUCCESS,
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

  if (!global.actionTypes) {
    global.actionTypes = {};
  }

  global.actionTypes.ACLGroupsActions = {
    fetch: {event: "success", success: {response: groupsFixture}},
    fetchGroup: {event: "success", success: {response: groupFixture}},
    fetchGroupPermissions: {event: "success", success: {
      response: groupDetailsFixture.permissions
    }},
    fetchGroupUsers: {event: "success", success: {
      response: groupDetailsFixture.users
    }},
    addGroup: {event: "success"},
    updateGroup: {event: "success"},
    deleteGroup: {event: "success"},
    addUser: {event: "success"},
    deleteUser: {event: "success"}
  };

  Object.keys(global.actionTypes.ACLGroupsActions).forEach(function (method) {
    ACLGroupsActions[method] = RequestUtil.stubRequest(
      ACLGroupsActions, "ACLGroupsActions", method
    );
  });
}

export default ACLGroupsActions;
