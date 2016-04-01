import {Store} from 'mesosphere-shared-reactjs';

import {
  REQUEST_LOGIN_SUCCESS,
  REQUEST_LOGIN_ERROR,
  REQUEST_LOGOUT_SUCCESS,
  REQUEST_LOGOUT_ERROR,
  REQUEST_ROLE_SUCCESS,
  REQUEST_ROLE_ERROR,
  SERVER_ACTION
} from '../constants/ActionTypes';

import {
  AUTH_USER_ROLE_CHANGED,
  AUTH_USER_LOGIN_CHANGED,
  AUTH_USER_LOGOUT_SUCCESS,
  AUTH_USER_LOGIN_ERROR,
  AUTH_USER_LOGOUT_ERROR
} from '../constants/EventTypes';

import AppDispatcher from '../events/AppDispatcher';
import AuthActions from '../actions/AuthActions';
import UserRoles from '../constants/UserRoles';
import CookieUtils from '../utils/CookieUtils';
import GetSetMixin from '../mixins/GetSetMixin';
import {Hooks} from 'PluginSDK';

// TODO - move to Plugin. Plugins responsibility to register this if it needs it
Hooks.addFilter('serverErrorModalListeners', function (listeners) {
  listeners.push({
    name: 'auth',
    events: ['logoutError']
  });

  return listeners;
});

let AuthStore = Store.createStore({
  storeID: 'auth',

  mixins: [GetSetMixin],

  getSet_data: {
    role: undefined
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  login: AuthActions.login,

  logout: AuthActions.logout,

  fetchRole: AuthActions.fetchRole,

  isLoggedIn: function () {
    return !!CookieUtils.getUserMetadata();
  },

  getUser: function () {
    let userCode = CookieUtils.getUserMetadata();

    if (!userCode) {
      return null;
    }

    try {
      return JSON.parse(atob(userCode));
    } catch(err) {
      return null;
    }
  },

  hasRole() {
    return !!this.get('role');
  },

  isAdmin() {
    return this.get('role') === UserRoles.admin;
  },

  makeAdminRole() {
    let role = this.get('role');
    if (role !== UserRoles.admin) {
      this.set({
        role: UserRoles.admin
      });
      this.emit(AUTH_USER_ROLE_CHANGED);
    }
  },

  makeDefaultRole() {
    let role = this.get('role');
    if (role !== UserRoles.default) {
      this.set({
        role: UserRoles.default
      });
      this.emit(AUTH_USER_ROLE_CHANGED);
    }
  },

  resetRole() {
    this.set({
        role: undefined
      });
  },

  processLoginSuccess() {
    // Reset role before fetching new one
    this.resetRole();

    let user = this.getUser();
    if (!user) {
      this.makeDefaultRole();
    }
    this.emit(AUTH_USER_LOGIN_CHANGED);
  },

  processLogoutSuccess: function () {
    // Set the cookie to an empty string.
    global.document.cookie = CookieUtils.emptyCookieWithExpiry(new Date(1970));

    this.resetRole();
    this.emit(AUTH_USER_LOGOUT_SUCCESS);

    Hooks.doAction('userLogoutSuccess');
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    if (payload.source !== SERVER_ACTION) {
      return false;
    }

    var action = payload.action;
    switch (action.type) {
      case REQUEST_LOGIN_SUCCESS:
        AuthStore.processLoginSuccess();
        break;
      case REQUEST_LOGIN_ERROR:
        AuthStore.emit(AUTH_USER_LOGIN_ERROR, action.data);
        break;
      case REQUEST_LOGOUT_SUCCESS:
        AuthStore.processLogoutSuccess();
        break;
      case REQUEST_LOGOUT_ERROR:
        AuthStore.emit(AUTH_USER_LOGOUT_ERROR, action.data);
        break;
      // Get role of current user
      case REQUEST_ROLE_SUCCESS:
        AuthStore.makeAdminRole();
        break;
      // Get role of current user
      case REQUEST_ROLE_ERROR:
        AuthStore.makeDefaultRole();
        break;
    }

    return true;
  })

});

module.exports = AuthStore;
