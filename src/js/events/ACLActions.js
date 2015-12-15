import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "./AppDispatcher";
import Config from "../config/Config";
import RequestUtil from "../utils/RequestUtil";

const ACLActions = {

  fetchACLsForResource: function (resourceType) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/acls?type=${resourceType}`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_RESOURCE_ACLS_SUCCESS,
          data: response.array,
          resourceType
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_RESOURCE_ACLS_ERROR,
          data: e.error,
          resourceType
        });
      }
    });
  },

  grantUserActionToResource: function (userID, action, resourceID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/acls/${resourceID}/users/${userID}/${action}`,
      type: "PUT",
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_GRANT_ACTION_SUCCESS,
          triple: {userID, action, resourceID}
        });
      },
      error: function (e) {
        e = RequestUtil.parseResponseBody(e);
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_GRANT_ACTION_ERROR,
          data: e.error,
          triple: {userID, action, resourceID}
        });
      }
    });
  },

  revokeUserActionToResource: function (userID, action, resourceID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/acls/${resourceID}/users/${userID}/${action}`,
      type: "DELETE",
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_REVOKE_ACTION_SUCCESS,
          triple: {userID, action, resourceID}
        });
      },
      error: function (e) {
        e = RequestUtil.parseResponseBody(e);
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_REVOKE_ACTION_ERROR,
          data: e.error,
          triple: {userID, action, resourceID}
        });
      }
    });
  },

  grantGroupActionToResource: function (groupID, action, resourceID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/acls/${resourceID}/groups/${groupID}/${action}`,
      type: "PUT",
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_GRANT_ACTION_SUCCESS,
          triple: {groupID, action, resourceID}
        });
      },
      error: function (e) {
        e = RequestUtil.parseResponseBody(e);
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_GRANT_ACTION_ERROR,
          data: e.error,
          triple: {groupID, action, resourceID}
        });
      }
    });
  },

  revokeGroupActionToResource: function (groupID, action, resourceID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/acls/${resourceID}/groups/${groupID}/${action}`,
      type: "DELETE",
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_REVOKE_ACTION_SUCCESS,
          triple: {groupID, action, resourceID}
        });
      },
      error: function (e) {
        e = RequestUtil.parseResponseBody(e);
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_REVOKE_ACTION_ERROR,
          data: e.error,
          triple: {groupID, action, resourceID}
        });
      }
    });
  }

};

if (Config.useFixtures) {
  let aclsFixture =
    require("json!../../../tests/_fixtures/acl/acls-unicode.json");

  if (!global.actionTypes) {
    global.actionTypes = {};
  }

  global.actionTypes.ACLActions = {
    fetchACLsForResource: {event: "success", success: {
      response: aclsFixture
    }},
    grantUserActionToResource: {event: "success"},
    revokeUserActionToResource: {event: "success"},
    grantGroupActionToResource: {event: "success"},
    revokeGroupActionToResource: {event: "success"}
  };

  Object.keys(global.actionTypes.ACLActions).forEach(function (method) {
    ACLActions[method] = RequestUtil.stubRequest(
      ACLActions, "ACLActions", method
    );
  });
}

export default ACLActions;
