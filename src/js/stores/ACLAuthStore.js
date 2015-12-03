import cookie from "cookie";

import ACLAuthActions from "../events/ACLAuthActions";
import EventTypes from "../constants/EventTypes";
import Store from "../utils/Store";

const USER_COOKIE_KEY = "ACLMetadata";

function getUserMetadata() {
  return cookie.parse(global.document.cookie)[USER_COOKIE_KEY];
}

var ACLAuthStore = Store.createStore({
  storeID: "auth",

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
  }
});

module.exports = ACLAuthStore;
