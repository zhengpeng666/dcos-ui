import _ from 'underscore';

import {
  ACL_GROUPS_CHANGE,
  ACL_GROUP_SET_GROUPS,
  ACL_GROUP_SET_GROUPS_FETCHING
} from './constants/EventTypes';

let SDK = require('../../SDK').getSDK();

const initialState = {
  list: [],
  byId: {},
  groupsFetching: {}
};

module.exports = function (state = initialState, action) {
  if (action.__origin !== SDK.pluginID) {
    return state;
  }

  switch (action.type) {
    case ACL_GROUPS_CHANGE:
      return _.extend({}, state, {list: action.groups});

    case ACL_GROUP_SET_GROUPS:
      return _.extend({}, state, {byId: action.groups});

    case ACL_GROUP_SET_GROUPS_FETCHING:
      return _.extend({}, state, {groupsFetching: action.groupsFetching});

    default:
      return state;
  }
};
