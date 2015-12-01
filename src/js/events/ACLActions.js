import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "./AppDispatcher";
import Config from "../config/Config";
import RequestUtil from "../utils/RequestUtil";

const ACLActions = {

  fetchACLs: function (type) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/acls?type=${type}`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_RESOURCE_SUCCESS,
          data: response
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_RESOURCE_ERROR,
          data: e
        });
      }
    });
  },

  grantUserActionToResource: function (userID, resourceID, action) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/acls/${resourceID}/users/${userID}/${action}`,
      type: "PUT",
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_GRANT_ACTION_SUCCESS,
          data: {action, userID, resourceID}
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_GRANT_ACTION_ERROR,
          data: {action, userID, resourceID, error: e}
        });
      }
    });
  },

  revokeUserActionToResource: function (userID, resourceID, action) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/acls/${resourceID}/users/${userID}/${action}`,
      type: "DELETE",
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_REVOKE_ACTION_SUCCESS,
          data: {action, userID, resourceID}
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_REVOKE_ACTION_ERROR,
          data: {action, userID, resourceID, error: e}
        });
      }
    });
  },

  grantGroupActionToResource: function (groupID, resourceID, action) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/acls/${resourceID}/groups/${groupID}/${action}`,
      type: "PUT",
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_GRANT_ACTION_SUCCESS,
          data: {action, groupID, resourceID}
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_GRANT_ACTION_ERROR,
          data: {action, groupID, resourceID, error: e}
        });
      }
    });
  },

  revokeGroupActionToResource: function (groupID, resourceID, action) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/acls/${resourceID}/groups/${groupID}/${action}`,
      type: "DELETE",
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_REVOKE_ACTION_SUCCESS,
          data: {action, groupID, resourceID}
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_REVOKE_ACTION_ERROR,
          data: {action, groupID, resourceID, error: e}
        });
      }
    });
  }

};

import aclsFixture from "json!../../../tests/_fixtures/acl/acls-unicode.json";

if (Config.useFixtures) {

  ACLActions.fetchACLs = function () {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_RESOURCE_SUCCESS,
      data: aclsFixture
    });
  };

  ACLActions.grantUserActionToResource = function (action, userID, resourceID) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_USER_GRANT_ACTION_SUCCESS,
      userID,
      resourceID
    });
  };

  ACLActions.revokeUserActionToResource = function (action, userID, resourceID) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_USER_REVOKE_ACTION_SUCCESS,
      userID,
      resourceID
    });
  };

  ACLActions.grantGroupActionToResource = function (action, groupID, resourceID) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_GROUP_GRANT_ACTION_SUCCESS,
      groupID,
      resourceID
    });
  };

  ACLActions.revokeGroupActionToResource = function (action, groupID, resourceID) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_GROUP_REVOKE_ACTION_SUCCESS,
      groupID,
      resourceID
    });
  };

}

export default ACLActions;
