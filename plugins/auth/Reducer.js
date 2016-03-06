import _ from 'underscore';

import {
  ACL_AUTH_USER_ROLE_CHANGED,
  ACL_AUTH_LOGIN_REDIRECT
} from './constants/EventTypes';

let SDK = require('./SDK').getSDK();

let initialState = {
  role: undefined
};

module.exports = function (state = initialState, action) {
  if (action.__origin !== SDK.pluginID) {
    return state;
  }

  switch (action.type) {

    case ACL_AUTH_USER_ROLE_CHANGED:
      return _.extend({}, state, {role: action.role});

    case ACL_AUTH_LOGIN_REDIRECT:
      let {loginRedirectRoute} = action;
      return _.extend({}, state, {loginRedirectRoute});
    default:
      return state;
  }
};
