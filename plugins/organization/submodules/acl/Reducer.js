import _ from 'underscore';

import {ACL_RESOURCE_ACLS_CHANGE} from './constants/EventTypes';

let SDK = require('../../SDK').getSDK();

module.exports = function (state = {}, action) {
  if (action.__origin !== SDK.pluginID) {
    return state;
  }

  switch (action.type) {
    case ACL_RESOURCE_ACLS_CHANGE:
      return _.extend({}, state, action.data);
    default:
      return state;
  }
};
