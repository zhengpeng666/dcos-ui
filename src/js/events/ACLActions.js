import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "./AppDispatcher";
import Config from "../config/Config";
import RequestUtil from "../utils/RequestUtil";

const ACLActions = {

  fetchACLsForResource: function (type) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.apiPrefix}/acls?type=${type}`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_RESOURCE_ACLS_SUCCESS,
          data: {response, type}
        });
      },
      error: function (error) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_RESOURCE_ACLS_ERROR,
          data: {error, type}
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
          data: {userID, action, resourceID}
        });
      },
      error: function (error) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_GRANT_ACTION_ERROR,
          data: {userID, action, resourceID, error}
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
          data: {userID, action, resourceID}
        });
      },
      error: function (error) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_REVOKE_ACTION_ERROR,
          data: {userID, action, resourceID, error}
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
          data: {groupID, action, resourceID}
        });
      },
      error: function (error) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_GRANT_ACTION_ERROR,
          data: {groupID, action, resourceID, error}
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
          data: {groupID, action, resourceID}
        });
      },
      error: function (error) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_REVOKE_ACTION_ERROR,
          data: {groupID, action, resourceID, error}
        });
      }
    });
  }

};

import aclsFixture from "json!../../../tests/_fixtures/acl/acls-unicode.json";

if (Config.useFixtures) {
  ACLActions.fetchACLsForResource = function (type) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_RESOURCE_ACLS_SUCCESS,
      data: {response: aclsFixture, type}
    });
  };

  ACLActions.grantUserActionToResource =
    function (userID, action, resourceID) {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_ACL_USER_GRANT_ACTION_SUCCESS,
        data: {userID, action, resourceID}
      });
    };

  ACLActions.revokeUserActionToResource =
    function (userID, action, resourceID) {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_ACL_USER_REVOKE_ACTION_SUCCESS,
        data: {userID, action, resourceID}
      });
    };

  ACLActions.grantGroupActionToResource =
    function (groupID, action, resourceID) {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_ACL_GROUP_GRANT_ACTION_SUCCESS,
        data: {groupID, action, resourceID}
      });
    };

  ACLActions.revokeGroupActionToResource =
    function (groupID, action, resourceID) {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_ACL_GROUP_REVOKE_ACTION_SUCCESS,
        data: {groupID, action, resourceID}
      });
    };

}

export default ACLActions;
