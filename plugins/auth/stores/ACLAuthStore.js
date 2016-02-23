import {Store} from 'mesosphere-shared-reactjs';

import {
  REQUEST_ACL_LOGIN_SUCCESS,
  REQUEST_ACL_LOGIN_ERROR,
  REQUEST_ACL_LOGOUT_SUCCESS,
  REQUEST_ACL_LOGOUT_ERROR,
  REQUEST_ACL_ROLE_SUCCESS,
  REQUEST_ACL_ROLE_ERROR
} from '../constants/ActionTypes';

import {
  ACL_AUTH_USER_ROLE_CHANGED,
  ACL_AUTH_USER_LOGIN_CHANGED,
  ACL_AUTH_USER_LOGOUT_SUCCESS,
  ACL_AUTH_USER_LOGIN_ERROR,
  ACL_AUTH_USER_LOGOUT_ERROR
} from '../constants/EventTypes';

import ACLAuthActions from '../actions/ACLAuthActions';
import ACLUserRoles from '../constants/ACLUserRoles';

import Utils from '../utils';

// TO REMOVE
import {SERVER_ACTION} from '../../../src/js/constants/ActionTypes';
import AppDispatcher from '../../../src/js/events/AppDispatcher';
import GetSetMixin from '../../../src/js/mixins/GetSetMixin';
import {Hooks} from '../../../src/js/pluginBridge/PluginBridge';

var ACLAuthStore = Store.createStore({
  storeID: 'auth',

  mixins: [GetSetMixin],

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  login: ACLAuthActions.login,

  logout: ACLAuthActions.logout,

  fetchRole: ACLAuthActions.fetchRole,

  isLoggedIn: function () {
    return !!Utils.getUserMetadata();
  },

  getUser: function () {
    let userCode = Utils.getUserMetadata();

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
    return this.get('role') === ACLUserRoles.admin;
  },

  makeAdminRole() {
    let role = this.get('role');
    if (role !== ACLUserRoles.admin) {
      this.set({role: ACLUserRoles.admin});
      this.emit(ACL_AUTH_USER_ROLE_CHANGED);
    }
  },

  makeDefaultRole() {
    let role = this.get('role');
    if (role !== ACLUserRoles.default) {
      this.set({role: ACLUserRoles.default});
      this.emit(ACL_AUTH_USER_ROLE_CHANGED);
    }
  },

  resetRole() {
    this.set({role: undefined});
  },

  processLoginSuccess() {
    // Reset role before fetching new one
    this.resetRole();

    let user = this.getUser();
    if (!user) {
      this.makeDefaultRole();
    }
    this.emit(ACL_AUTH_USER_LOGIN_CHANGED);
  },

  processLogoutSuccess: function () {
    // Set the cookie to an empty string.
    global.document.cookie = Utils.emtpyCookieWithExpiry(new Date(1970));

    this.resetRole();
    this.emit(ACL_AUTH_USER_LOGOUT_SUCCESS);

    Hooks.doAction('userLogoutSuccess');
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let source = payload.source;
    if (source !== SERVER_ACTION) {
      return false;
    }

    let action = payload.action;

    switch (action.type) {
      case REQUEST_ACL_LOGIN_SUCCESS:
        ACLAuthStore.processLoginSuccess();
        break;
      case REQUEST_ACL_LOGIN_ERROR:
        ACLAuthStore.emit(ACL_AUTH_USER_LOGIN_ERROR, action.data);
        break;
      case REQUEST_ACL_LOGOUT_SUCCESS:
        ACLAuthStore.processLogoutSuccess();
        break;
      case REQUEST_ACL_LOGOUT_ERROR:
        ACLAuthStore.emit(ACL_AUTH_USER_LOGOUT_ERROR, action.data);
        break;
      // Get role of current user
      case REQUEST_ACL_ROLE_SUCCESS:
        ACLAuthStore.makeAdminRole();
        break;
      // Get role of current user
      case REQUEST_ACL_ROLE_ERROR:
        ACLAuthStore.makeDefaultRole();
        break;
    }

    return true;
  })
});

module.exports = ACLAuthStore;
