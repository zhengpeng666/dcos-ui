import _ from 'underscore';

import {
  NETWORKING_BACKEND_CONNECTIONS_CHANGE,
  NETWORKING_NODE_MEMBERSHIP_CHANGE,
  NETWORKING_VIP_DETAIL_CHANGE,
  NETWORKING_VIPS_CHANGE
} from './constants/EventTypes';

let SDK = require('./SDK').getSDK();

let initialState = {
  backendConnections: {},
  vips: [],
  vipDetail: {}
};

module.exports = function (state = initialState, action) {
  if (action.__origin !== SDK.pluginID) {
    return state;
  }
  switch (action.type) {
    case NETWORKING_VIP_DETAIL_CHANGE:
      let {vipDetail} = action;
      return _.extend({}, state, {vipDetail});

    case NETWORKING_VIPS_CHANGE:
      return _.extend({}, state, {vips: action.vips});

    case NETWORKING_NODE_MEMBERSHIP_CHANGE:
      let {nodeMemberships} = action;
      return _.extend({}, state, {nodeMemberships});

    case NETWORKING_BACKEND_CONNECTIONS_CHANGE:
      let {backendConnections} = action;
      return _.extend({}, state, {backendConnections});

    default:
      return state;
  }
};
