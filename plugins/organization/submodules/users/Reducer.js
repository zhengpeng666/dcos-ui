import _ from 'underscore';

import {
  ACL_USER_SET_USER,
  ACL_USERS_CHANGE,
  ACL_USER_DETAILS_FETCH_START,
  ACL_USER_DETAILS_FETCHED_SUCCESS,
  ACL_USER_DETAILS_FETCHED_ERROR
} from './constants/EventTypes';

let SDK = require('../../SDK').getSDK();

const initialState = {
  users: [],
  userDetail: {},
  usersFetching: {}
};

module.exports = function (state = initialState, action) {
  if (action.__origin !== SDK.pluginID) {
    return state;
  }

  switch (action.type) {
    case ACL_USERS_CHANGE:
      return _.extend({}, state, {users: action.users});

    case ACL_USER_SET_USER:
      return _.extend({}, state, {userDetail: action.users});

    case ACL_USER_DETAILS_FETCH_START:
    case ACL_USER_DETAILS_FETCHED_SUCCESS:
    case ACL_USER_DETAILS_FETCHED_ERROR:
      return _.extend({}, state, {usersFetching: action.usersFetching});

    default:
      return state;
  }
};
