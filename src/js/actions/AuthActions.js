import cookie from 'cookie';

import {
  REQUEST_LOGIN_SUCCESS,
  REQUEST_LOGIN_ERROR,
  REQUEST_LOGOUT_SUCCESS,
  REQUEST_LOGOUT_ERROR,
  REQUEST_ROLE_SUCCESS,
  REQUEST_ROLE_ERROR
} from '../constants/ActionTypes';

import AppDispatcher from '../events/AppDispatcher';
import AuthConstants from '../constants/AuthConstants';
import Config from '../config/Config';
import RequestUtil from '../utils/RequestUtil';

const AuthActions = {
  fetchRole: function (uid) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.acsAPIPrefix}/users/${uid}`,
      success: function () {
        AppDispatcher.handleServerAction({
          type: REQUEST_ROLE_SUCCESS
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: REQUEST_ROLE_ERROR,
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
            cookie.serialize(AuthConstants.userCookieKey,
              'eyJ1aWQiOiJqb2UiLCJkZXNjcmlwdGlvbiI6IkpvZSBEb2UifQ=='
            );
        }

        AppDispatcher.handleServerAction({
          type: REQUEST_LOGIN_SUCCESS
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: REQUEST_LOGIN_ERROR,
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
          type: REQUEST_LOGOUT_SUCCESS
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: REQUEST_LOGOUT_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr)
        });
      }
    });
  }
};

if (Config.useFixtures) {
  AuthActions.login = function () {
    global.document.cookie =
      'dcos-acs-info-cookie=' +
        'eyJ1aWQiOiJqb2UiLCJkZXNjcmlwdGlvbiI6IkpvZSBEb2UifQ==';
    AppDispatcher.handleServerAction({
      type: REQUEST_LOGIN_SUCCESS
    });
  };
}

module.exports = AuthActions;
