import _ from 'underscore';

import {INTERCOM_CHANGE} from './constants/EventTypes';

let SDK = require('./SDK').getSDK();

let initialState = {
  isOpen: false
};

module.exports = function (state = initialState, action) {
  if (action.__origin !== SDK.pluginID) {
    return state;
  }

  switch (action.type) {
    case INTERCOM_CHANGE:
      return _.extend({}, {isOpen: action.isOpen});
    default:
      return state;
  }
};
