/**
 * A mixin to store component data that isn't part of properties or
 * part of state.
 */

var InternalStorageMixin = {

  internalStorage_data: {},

  internalStorage_set: function (data) {
    this.internalStorage_data = data;
  },

  internalStorage_get: function () {
    return this.internalStorage_data;
  }

};

module.exports = InternalStorageMixin;
