/**
 * A mixin to store component data that isn't part of properties or
 * part of state.
 */

var _ = require("underscore");

var InternalStorageMixin = {

  internalStorage_data: {},

  internalStorage_get: function () {
    return this.internalStorage_data;
  },

  internalStorage_update: function (diff) {
    this.internalStorage_data = _.extend(this.internalStorage_get(), diff);
  },

  internalStorage_set: function (data) {
    this.internalStorage_data = data;
  }

};

module.exports = InternalStorageMixin;
