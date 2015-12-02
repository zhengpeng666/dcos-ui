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
          data: response,
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
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_GRANT_ACTION_SUCCESS,
          data: response,
          triple: {userID, action, resourceID}
        });
      },
      error: function (e) {
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
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_REVOKE_ACTION_SUCCESS,
          data: response,
          triple: {userID, action, resourceID}
        });
      },
      error: function (e) {
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
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_GRANT_ACTION_SUCCESS,
          data: response,
          triple: {groupID, action, resourceID}
        });
      },
      error: function (e) {
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
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_REVOKE_ACTION_SUCCESS,
          data: response,
          triple: {groupID, action, resourceID}
        });
      },
      error: function (e) {
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

  ACLActions.fetchACLsForResource = function (resourceType) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_ACL_RESOURCE_ACLS_SUCCESS,
      data: aclsFixture,
      resourceType
    });
  };

  ACLActions.grantUserActionToResource =
    function (userID, action, resourceID) {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_ACL_USER_GRANT_ACTION_SUCCESS,
        data: {},
        triple: {userID, action, resourceID}
      });
    };

  ACLActions.revokeUserActionToResource =
    function (userID, action, resourceID) {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_ACL_USER_REVOKE_ACTION_SUCCESS,
        data: {},
        triple: {userID, action, resourceID}
      });
    };

  ACLActions.grantGroupActionToResource =
    function (groupID, action, resourceID) {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_ACL_GROUP_GRANT_ACTION_SUCCESS,
        data: {},
        triple: {groupID, action, resourceID}
      });
    };

  ACLActions.revokeGroupActionToResource =
    function (groupID, action, resourceID) {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_ACL_GROUP_REVOKE_ACTION_SUCCESS,
        data: {},
        triple: {groupID, action, resourceID}
      });
    };

}

export default ACLActions;
