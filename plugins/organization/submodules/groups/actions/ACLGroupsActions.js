import _ from 'underscore';

import ActionTypes from '../constants/ActionTypes';

let SDK = require('../../../SDK').getSDK();

let {RequestUtil, Config} = SDK.get(['RequestUtil', 'Config']);

const ACLGroupsActions = {
  fetch: function () {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/groups`,
      success: function (response) {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUPS_SUCCESS,
          data: response.array
        });
      },
      error: function (xhr) {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUPS_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr)
        });
      }
    });
  },

  fetchGroup: function (groupID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/groups/${groupID}`,
      success: function (response) {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_SUCCESS,
          data: response
        });
      },
      error: function (xhr) {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          groupID
        });
      }
    });
  },

  fetchGroupPermissions: function (groupID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/groups/${groupID}/permissions`,
      success: function (response) {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_PERMISSIONS_SUCCESS,
          data: response.array,
          groupID
        });
      },
      error: function (xhr) {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_PERMISSIONS_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          groupID
        });
      }
    });
  },

  fetchGroupUsers: function (groupID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/groups/${groupID}/users`,
      success: function (response) {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_USERS_SUCCESS,
          data: response.array,
          groupID
        });
      },
      error: function (xhr) {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_USERS_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          groupID
        });
      }
    });
  },

  addGroup: function (data) {
    let groupID = data.gid;
    data = _.omit(data, 'gid');

    if (!groupID && data.description) {
      groupID = data.description.replace(/\s+/g, '').toLowerCase();
    }

    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/groups/${groupID}`,
      method: 'PUT',
      data,
      success: function () {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_CREATE_SUCCESS,
          groupID
        });
      },
      error: function (xhr) {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_CREATE_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          groupID
        });
      }
    });
  },

  updateGroup: function (groupID, patchData) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/groups/${groupID}`,
      method: 'PATCH',
      data: patchData,
      success: function () {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_UPDATE_SUCCESS,
          groupID
        });
      },
      error: function (xhr) {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_UPDATE_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          groupID
        });
      }
    });
  },

  deleteGroup: function (groupID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/groups/${groupID}`,
      method: 'DELETE',
      success: function () {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_DELETE_SUCCESS,
          groupID
        });
      },
      error: function (xhr) {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_DELETE_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          groupID
        });
      }
    });
  },

  addUser: function (groupID, userID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/groups/${groupID}/users/${userID}`,
      method: 'PUT',
      success: function () {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_ADD_USER_SUCCESS,
          groupID,
          userID
        });
      },
      error: function (xhr) {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_ADD_USER_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          groupID,
          userID
        });
      }
    });
  },

  deleteUser: function (groupID, userID) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/groups/${groupID}/users/${userID}`,
      method: 'DELETE',
      success: function () {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_REMOVE_USER_SUCCESS,
          groupID,
          userID
        });
      },
      error: function (xhr) {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_GROUP_REMOVE_USER_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          groupID,
          userID
        });
      }
    });
  }
};

if (Config.useFixtures) {
  let groupFixture = require('../../../../../tests/_fixtures/acl/group-unicode.json');
  let groupDetailsFixture = require('../../../../../tests/_fixtures/acl/group-with-details.json');
  let groupsFixture = require('../../../../../tests/_fixtures/acl/groups-unicode.json');

  if (!global.actionTypes) {
    global.actionTypes = {};
  }

  global.actionTypes.ACLGroupsActions = {
    fetch: {event: 'success', success: {response: groupsFixture}},
    fetchGroup: {event: 'success', success: {response: groupFixture}},
    fetchGroupPermissions: {event: 'success', success: {
      response: groupDetailsFixture.permissions
    }},
    fetchGroupUsers: {event: 'success', success: {
      response: groupDetailsFixture.users
    }},
    addGroup: {event: 'success'},
    updateGroup: {event: 'success'},
    deleteGroup: {event: 'success'},
    addUser: {event: 'success'},
    deleteUser: {event: 'success'}
  };

  Object.keys(global.actionTypes.ACLGroupsActions).forEach(function (method) {
    ACLGroupsActions[method] = RequestUtil.stubRequest(
      ACLGroupsActions, 'ACLGroupsActions', method
    );
  });
}

module.exports = ACLGroupsActions;
