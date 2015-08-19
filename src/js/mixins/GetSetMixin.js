/**
 * A mixin to create getter and setter functions for store data
 */

var _ = require("underscore");

var GetSetMixin = {

  getSet_data: {},

  get: function (key) {
    return this.getSet_data[key];
  },

  set: function (data) {
    if (!_.isObject(data)) {
      throw new Error("Can only update getSet_data with data of type Object.");
    }

    _.extend(this.getSet_data, data);
  }

};

module.exports = GetSetMixin;
