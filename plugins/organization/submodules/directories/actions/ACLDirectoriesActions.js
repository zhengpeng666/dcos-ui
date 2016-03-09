import ActionTypes from '../constants/ActionTypes';

let SDK = require('../../../SDK').getSDK();

let {RequestUtil, Config} = SDK.get(['RequestUtil', 'Config']);

module.exports = {

  fetchDirectories: function () {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/ldap/config`,
      success: function (response) {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_DIRECTORIES_SUCCESS,
          // TODO: Remove this array, currently we're forcing an array
          // even though the API is only storing one directory
          data: [response]
        });
      },
      error: function (xhr) {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_DIRECTORIES_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr)
        });
      }
    });
  },

  addDirectory: function (data) {
    data.port = parseInt(data.port, 10);

    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/ldap/config`,
      method: 'PUT',
      data,
      success: function () {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_DIRECTORY_ADD_SUCCESS
        });
      },
      error: function (xhr) {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_DIRECTORY_ADD_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr)
        });
      }
    });
  },

  deleteDirectory: function () {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/ldap/config`,
      method: 'DELETE',
      success: function () {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_DIRECTORY_DELETE_SUCCESS
        });
      },
      error: function (xhr) {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_DIRECTORY_DELETE_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr)
        });
      }
    });
  },

  testDirectoryConnection: function (data) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/ldap/config/test`,
      method: 'POST',
      data,
      success: function (response) {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_DIRECTORY_TEST_SUCCESS,
          data: response.description
        });
      },
      error: function (xhr) {
        SDK.dispatch({
          type: ActionTypes.REQUEST_ACL_DIRECTORY_TEST_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr)
        });
      }
    });
  }
};
