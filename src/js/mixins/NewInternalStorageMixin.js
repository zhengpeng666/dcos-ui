/**
 * A mixin to store component data that isn't part of properties or
 * part of state.
 *
 * Usage of this mixin:
 *
 *  class Blah extends InternalStorageMixin( SuperClass ) {
 *
 * @param {class} Base - The Base class to extend
 * @returns {class} The base class extended with the InternalStorage mixin
 */
var InternalStorageMixin = (Base) => class InternalStorageMixin extends Base {

  /**
   * Initialize the properties in the constructor
   */
  // constructor() {
    // super();
    // this.internalStorage_data = {};
  // }

  internalStorage_get() {
    return this.internalStorage_data || {};
  };

  internalStorage_update(diff) {
    if (typeof this.internalStorage_data !== 'object') {
      throw new Error('Can only update internalStorage_data if that is of type Object or Array.');
    }

    this.internalStorage_data = Object.assign(this.internalStorage_get(), diff);
  };

  internalStorage_set(data) {
    this.internalStorage_data = data;
  };

};

module.exports = InternalStorageMixin;
