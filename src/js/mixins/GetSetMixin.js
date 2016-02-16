/**
 * A mixin to create getter and setter functions for store data
 */

var _ = require('underscore');

import {
  APP_STORE_CHANGE
} from '../constants/EventTypes';

import {dispatch} from '../pluginBridge/PluginBridge';

var GetSetMixin = {

  get: function (key) {
    if (typeof this.getSet_data === 'undefined') {
      return null;
    }

    return this.getSet_data[key];
  },

  set: function (data) {
    if (!_.isObject(data) || _.isArray(data)) {
      throw new Error('Can only update getSet_data with data of type Object.');
    }

    // Allows overriding `getSet_data` wherever this is implemented
    if (typeof this.getSet_data === 'undefined') {
      this.getSet_data = {};
    }

    _.extend(this.getSet_data, data);

    // Dispatch new Store data to pluginBridge
    dispatch({
      type: APP_STORE_CHANGE,
      storeID: this.storeID,
      data: this.getSet_data
    });
  }

};

module.exports = GetSetMixin;
