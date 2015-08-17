var GetSetInternalStorageMixin = {
  get: function (key) {
    return this.internalStorage_get()[key];
  },

  set: function (data) {
    this.internalStorage_update(data);
  }
};

module.exports = GetSetInternalStorageMixin;
