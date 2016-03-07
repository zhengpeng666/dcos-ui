import _ from 'underscore';

import {ACL_GROUPS_CHANGE} from './constants/EventTypes';

let SDK = require('../../SDK').getSDK();

const initialState = {list: []};

module.exports = function (state = initialState, action) {
  if (action.__origin !== SDK.pluginID) {
    return state;
  }

  switch (action.type) {
    case ACL_GROUPS_CHANGE:
      return _.extend({}, state, {list: action.groups});
    default:
      return state;
  }
};
