/**
 * A mixin to create getter and setter functions for store data
 */

var _ = require('underscore');

var PluginBridge;

// Hack until we fix circular dependency - DCOS-5040
if (global.__DEV__) {
  PluginBridge = require('../pluginBridge/PluginBridge');
}

import {APP_STORE_CHANGE} from '../constants/EventTypes';

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

    if (!global.__DEV__) {
      PluginBridge = require('../pluginBridge/PluginBridge');
    }
    // Dispatch new Store data to pluginBridge
    PluginBridge.dispatch({
      type: APP_STORE_CHANGE,
      storeID: this.storeID,
      data: this.getSet_data
    });
  }

};

module.exports = GetSetMixin;
