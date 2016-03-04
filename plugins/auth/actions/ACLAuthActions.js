import cookie from 'cookie';

import {
  REQUEST_ACL_LOGIN_SUCCESS,
  REQUEST_ACL_LOGIN_ERROR,
  REQUEST_ACL_LOGOUT_SUCCESS,
  REQUEST_ACL_LOGOUT_ERROR,
  REQUEST_ACL_ROLE_SUCCESS,
  REQUEST_ACL_ROLE_ERROR
} from '../constants/ActionTypes';

import ACLAuthConstants from '../constants/ACLAuthConstants';

import AppDispatcher from '../../../src/js/events/AppDispatcher';

let SDK = require('../SDK').getSDK();
let {RequestUtil, Config} = SDK.get(['RequestUtil', 'Config']);

const ACLAuthActions = {
  fetchRole: function (uid) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/users/${uid}`,
      success: function () {
        AppDispatcher.handleServerAction({
          type: REQUEST_ACL_ROLE_SUCCESS
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: REQUEST_ACL_ROLE_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr)
        });
      }
    });
  },

  login: function (credentials) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/auth/login`,
      method: 'POST',
      data: credentials,
      success: function () {
        if (Config.environment === 'testing') {
          global.document.cookie =
            cookie.serialize(ACLAuthConstants.userCookieKey,
              'eyJ1aWQiOiJqb2UiLCJkZXNjcmlwdGlvbiI6IkpvZSBEb2UifQ=='
            );
        }

        AppDispatcher.handleServerAction({
          type: REQUEST_ACL_LOGIN_SUCCESS
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: REQUEST_ACL_LOGIN_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr)
        });
      }
    });
  },

  logout: function () {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/auth/logout`,
      success: function () {
        AppDispatcher.handleServerAction({
          type: REQUEST_ACL_LOGOUT_SUCCESS
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: REQUEST_ACL_LOGOUT_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr)
        });
      }
    });
  }
};

if (Config.useFixtures) {
  ACLAuthActions.login = function () {
    global.document.cookie =
      'dcos-acs-info-cookie=' +
        'eyJ1aWQiOiJqb2UiLCJkZXNjcmlwdGlvbiI6IkpvZSBEb2UifQ==';
    AppDispatcher.handleServerAction({
      type: REQUEST_ACL_LOGIN_SUCCESS
    });
  };
}

module.exports = ACLAuthActions;
