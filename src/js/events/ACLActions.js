import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from './AppDispatcher';
import Config from '../config/Config';
import RequestUtil from '../utils/RequestUtil';

const ACLActions = {

  createACLForResource: function (resourceID, data) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/acls/${resourceID}`,
      method: 'PUT',
      data,
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_CREATE_SUCCESS,
          resourceID
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_CREATE_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          resourceID
        });
      }
    });
  },

  fetchACLsForResource: function (resourceType) {

    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/acls?type=${resourceType}`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_RESOURCE_ACLS_SUCCESS,
          data: response.array,
          resourceType
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_RESOURCE_ACLS_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          resourceType
        });
      }
    });
  },

  grantUserActionToResource: function (userID, action, resourceID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/acls/${resourceID}/users/${userID}/${action}`,
      method: 'PUT',
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_GRANT_ACTION_SUCCESS,
          triple: {userID, action, resourceID}
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_GRANT_ACTION_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          triple: {userID, action, resourceID}
        });
      }
    });
  },

  revokeUserActionToResource: function (userID, action, resourceID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/acls/${resourceID}/users/${userID}/${action}`,
      method: 'DELETE',
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_REVOKE_ACTION_SUCCESS,
          triple: {userID, action, resourceID}
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_USER_REVOKE_ACTION_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          triple: {userID, action, resourceID}
        });
      }
    });
  },

  grantGroupActionToResource: function (groupID, action, resourceID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/acls/${resourceID}/groups/${groupID}/${action}`,
      method: 'PUT',
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_GRANT_ACTION_SUCCESS,
          triple: {groupID, action, resourceID}
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_GRANT_ACTION_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          triple: {groupID, action, resourceID}
        });
      }
    });
  },

  revokeGroupActionToResource: function (groupID, action, resourceID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/acls/${resourceID}/groups/${groupID}/${action}`,
      method: 'DELETE',
      success: function () {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_REVOKE_ACTION_SUCCESS,
          triple: {groupID, action, resourceID}
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_GROUP_REVOKE_ACTION_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          triple: {groupID, action, resourceID}
        });
      }
    });
  }

};

if (Config.useFixtures) {
  let aclsFixture =
    require('json!../../../tests/_fixtures/acl/acls-unicode.json');

  if (!global.actionTypes) {
    global.actionTypes = {};
  }

  global.actionTypes.ACLActions = {
    fetchACLsForResource: {event: 'success', success: {
      response: aclsFixture
    }},
    grantUserActionToResource: {event: 'success'},
    revokeUserActionToResource: {event: 'success'},
    grantGroupActionToResource: {event: 'success'},
    revokeGroupActionToResource: {event: 'success'}
  };

  Object.keys(global.actionTypes.ACLActions).forEach(function (method) {
    ACLActions[method] = RequestUtil.stubRequest(
      ACLActions, 'ACLActions', method
    );
  });
}

export default ACLActions;
