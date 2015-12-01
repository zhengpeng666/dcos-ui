import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "./AppDispatcher";
import Config from "../config/Config";
import RequestUtil from "../utils/RequestUtil";
import aclsFixture from "json!../../../tests/_fixtures/acl/acls-unicode.json";

const ACLActions = {

  fetchACLs: function (type) {
    RequestUtil.json({
      url: `${Config.rootUrl}/acls?type=${type}`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_SUCCESS,
          data: response
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_ERROR,
          data: e
        });
      }
    });
  },

  grantUserActionToResource: function (action, userID, resourceID) {
    RequestUtil.json({
      type: "PUT",
      url: `${Config.rootUrl}/acls/${resourceID}/users/${userID}/${action}`,
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GRANT_USER_ACTION_SUCCESS,
          userID,
          resourceID
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GRANT_USER_ACTION_ERROR,
          data: e,
          userID,
          resourceID
        });
      }
    });
  },

  revokeUserActionToResource: function (action, userID, resourceID) {
    RequestUtil.json({
      type: "DELETE",
      url: `${Config.rootUrl}/acls/${resourceID}/users/${userID}/${action}`,
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_REVOKE_USER_ACTION_SUCCESS,
          userID,
          resourceID
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_REVOKE_USER_ACTION_ERROR,
          data: e,
          userID,
          resourceID
        });
      }
    });
  },

  grantGroupActionToResource: function (action, groupID, resourceID) {
    RequestUtil.json({
      type: "PUT",
      url: `${Config.rootUrl}/acls/${resourceID}/groups/${groupID}/${action}`,
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GRANT_GROUP_ACTION_SUCCESS,
          groupID,
          resourceID
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GRANT_GROUP_ACTION_ERROR,
          data: e,
          groupID,
          resourceID
        });
      }
    });
  },

  revokeGroupActionToResource: function (action, groupID, resourceID) {
    RequestUtil.json({
      type: "DELETE",
      url: `${Config.rootUrl}/acls/${resourceID}/groups/${groupID}/${action}`,
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_REVOKE_GROUP_ACTION_SUCCESS,
          groupID,
          resourceID
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_REVOKE_GROUP_ACTION_ERROR,
          data: e,
          groupID,
          resourceID
        });
      }
    });
  }

};

if (Config.useFixtures) {
  ACLActions.fetchACLs = function () {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_SUCCESS,
      data: aclsFixture
    });
  };

  ACLActions.grantUserActionToResource = function (action, userID, resourceID) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_GRANT_USER_ACTION_SUCCESS,
      userID,
      resourceID
    });
  };

  ACLActions.revokeUserActionToResource = function (action, userID, resourceID) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_REVOKE_USER_ACTION_SUCCESS,
      userID,
      resourceID
    });
  };

  ACLActions.grantGroupActionToResource = function (action, groupID, resourceID) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_GRANT_GROUP_ACTION_SUCCESS,
      groupID,
      resourceID
    });
  };

  ACLActions.revokeGroupActionToResource = function (action, groupID, resourceID) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_REVOKE_GROUP_ACTION_SUCCESS,
      groupID,
      resourceID
    });
  };

}

export default ACLActions;
