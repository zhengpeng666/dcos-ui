/**
 * A mixin to create getter and setter functions for store data
 */

var _ = require('underscore');

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
  }

};

module.exports = GetSetMixin;
