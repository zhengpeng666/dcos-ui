import cookie from "cookie";

import ACLAuthActions from "../events/ACLAuthActions";
import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../events/AppDispatcher";
import EventTypes from "../constants/EventTypes";
import GetSetMixin from "../mixins/GetSetMixin";
import Store from "../utils/Store";

const USER_COOKIE_KEY = "ACLMetadata";

function getUserMetadata() {
  return cookie.parse(global.document.cookie)[USER_COOKIE_KEY];
}

var ACLAuthStore = Store.createStore({
  storeID: "auth",

  mixins: [GetSetMixin],

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  login: ACLAuthActions.login,

  isLoggedIn: function () {
    return !!getUserMetadata();
  },

  logout: function () {
    // Set the cookie to an empty string.
    global.document.cookie = cookie.serialize(USER_COOKIE_KEY, "", {
      expires: new Date(1970)
    });

    this.emit(EventTypes.ACL_AUTH_USER_LOGOUT);
  },

  saveLoginRedirectRoute: function (loginRedirectRoute) {
    this.set({loginRedirectRoute});
  },

  getUser: function () {
    let userCode = getUserMetadata();

    if (!userCode) {
      return null;
    }

    try {
      return JSON.parse(atob(userCode));
    } catch(err) {
      return null;
    }
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let source = payload.source;
    if (source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    let action = payload.action;

    switch (action.type) {
      // Get ACLs for resource
      case ActionTypes.REQUEST_ACL_LOGIN_SUCCESS:
        ACLAuthStore.emit(EventTypes.ACL_AUTH_USER_CHANGED);
        break;
      // Get ACLs for resource
      case ActionTypes.REQUEST_ACL_LOGIN_ERROR:
        ACLAuthStore.emit(EventTypes.ACL_AUTH_USER_LOGIN_ERROR);
        break;
    }

    return true;
  })
});

module.exports = ACLAuthStore;
