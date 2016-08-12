
/**
 * Helper function that monitors all the frequently-used array operators
 * that can cause a modification and triggers a callback when the modification
 * is completed.
 *
 * @param {array} array - The source array
 * @param {function} callback - The callback to call when a change occures
 * @returns {array} - The input array
 */
function listenForArrayChanges(array, callback) {

  // Override known array functions
  array.push = function () {
    let ans = Array.prototype.push.call(this, ...arguments);
    callback(this);
    return ans;
  };
  array.pop = function () {
    let ans = Array.prototype.pop.call(this, ...arguments);
    callback(this);
    return ans;
  };
  array.shift = function () {
    let ans = Array.prototype.pop.shift(this, ...arguments);
    callback(this);
    return ans;
  };
  array.unshift = function () {
    let ans = Array.prototype.pop.unshift(this, ...arguments);
    callback(this);
    return ans;
  };
  array.sort = function () {
    let ans = Array.prototype.pop.sort(this, ...arguments);
    callback(this);
    return ans;
  };
  array.reverse = function () {
    let ans = Array.prototype.pop.reverse(this, ...arguments);
    callback(this);
    return ans;
  };
  array.concat = function () {
    let ans = Array.prototype.pop.concat(this, ...arguments);
    callback(this);
    return ans;
  };

  return array;
}

/**
 * This function resolves string path to the correct nested
 * object in the second argument. It creates missing elements
 * and it triggers the callback with the one-but-last object
 * and the key were the item should be processed.
 *
 * This way you can create/update/delete the property in the
 * object since the function makes sure the correct references
 * are always kept.
 *
 * @param {string} path - The dot-separated path to resolve
 * @param {object} object - The object to walk over
 * @param {function} callback - The callback function to trigger with signature `function(object, key)`
 * @param {boolean} safe - If set to true this function will return undefined when a missing key is defined
 * @returns {any} - Returns the return value of the callback
 */
function walk(path, object, callback, safe = false) {
  let parts = path.split('.');
  let lastKey = parts.pop();

  // We prefer while instead of `reduce` because this way
  // we can break out of the loop the instance we have encountered
  // an invalid item, istead of waiting for the reduce function
  // to walk over the entire parts array
  while (parts.length) {
    let key = parts.shift();
    if (object[key] === undefined) {
      if (safe) {
        return undefined;
      } else {
        object[key] = {};
      }
    }
    object = object[key];
  }

  return callback( object, lastKey );
}

/**
 * A DataObject is the base class that other sturcts can use
 * in order to provide a simple access to the raw data we send
 * to the server.
 *
 * NOTE: Instead of manually accessing the object properties,
 *       you can use the `createAccessorFor` function to expose
 *       properties from the path.
 *
 * NOTE: If you want to get a high-level object at some particular
 *       point in the path, you can use the `createAccessorFor`, or
 *       the `getWithClass` functions.
 *
 * NOTE: This can be used as a drop-in replacement for the `Item`.
 */
class DataObject {

  constructor(data = {}) {
    this.__data = data;
  }

  /**
   * Helper function to dynamicaly create property-like
   * accessors to values of the data.
   *
   * @example <caption>How to use createAccessorFor</caption>
   *
   * this.createAliasFor('property.path.in.json').as('localProperty');
   * this.createAliasFor('another.property').withClass(CustomClass).as('advancedProperty')
   *
   * @param {string} path - The object path to create an accessor for
   * @returns {object} - Returns an object with an `as` function to specify the alias
   */
  createAccessorFor(path) {
    return {
      as: (alias) => {
        Object.defineProperty(this, alias, {
          configurable: false,
          enumerable: true,
          get: () => {
            return this.get(path);
          },
          set: (value) => {
            this.set(path, value);
          }
        });
      },

      /**
       * Use this function to transparently wrap the individual array items,
       * in case the values are in array format, with the given class.
       *
       * @param {class} ArrayClassDefinition - The class definition to wrap with
       * @returns {object} - Returns an object with an `as` function to specify the alias
       */
      wrapArrayItemsWith: (ArrayClassDefinition, ...arrayConstructorArgs) => {

        // Get value at this math and make sure it's an array
        let value = this.get(path);
        if (!value) {
          value = [];
        }
        if (!Array.isArray(value)) {
          value = [value];
        }

        // Generate the initial array by mapping the current values
        let objects = value.map(function (data) {
          return new ArrayClassDefinition(data, ...arrayConstructorArgs);
        });

        // Helper function to call in order to update values
        let update = (array) => {
          this.set(path, array.map(function (value) {
            if (value instanceof ArrayClassDefinition) {
              return value.__data;
            } else {
              console.warn('Refused to update array item in property', path, 'because it\'s not of type managed class type!');
            }
          }));
        };

        return {

          /**
           * Use this function to just return the array of mapped items as-is
           * without any further management on the array level.
           *
           * If you also want to wrap the array with a management class, use
           * the `wrappedWith` function.
           *
           * @param {string} alias - The property in the object to alias with
           */
          as: (alias) => {

            // Monitor changes to the array
            listenForArrayChanges(objects, update);

            // Return always the object that we manage internally
            // and if the user assigns a new value, manage the new
            // value the user gave.

            Object.defineProperty(this, alias, {
              configurable: false,
              enumerable: true,
              get: () => {
                return objects;
              },
              set: (value) => {
                if (!value) {
                  value = [];
                }
                if (!Array.isArray(value)) {
                  value = [value];
                }

                // Copy given array and listen for changes
                objects = array.slice();
                listenForArrayChanges(objects, update);

                // Also update properties
                update(objects);
              }
            });
          },

          /**
           * Use this function to also wrap the array of converted objects
           * with a secondary management class.
           *
           * IMPORTANT: You should NEVER destroy the array passed as an argument,
           *            since that's the only means of communication with the
           *            data object class.
           *
           * @param {class} ClassDefinition - The class definition to wrap the array with
           * @returns {object} - Returns an object with an `as` function to specify the alias
           */
          wrappedWith: (ClassDefinition, ...constructorArgs) => {

            // Create a single instance of management object that
            // we will return on the property getter.
            let managementObject = new ClassDefinition(objects, ...constructorArgs);

            // Monitor changes to the objects array in order to update
            // the actual values in the `__data` object.
            listenForArrayChanges(objects, update);

            return {
              as: (alias) => {
                Object.defineProperty(this, alias, {
                  configurable: false,
                  enumerable: true,
                  get: () => {
                    return managementObject;
                  }
                });

              }
            };
          }

        };

      },

      /**
       * Use this function to transparently wrap the data being read/written
       * with the given class definition.
       *
       * @param {class} ClassDefinition - The class definition to wrap with
       * @returns {object} - Returns an object with an `as` function to specify the alias
       */
      wrappedWith: (ClassDefinition, ...constructorArgs) => {

        // Some obvious validations
        if (!(ClassDefinition.prototype instanceof DataObject)) {
          console.error('Passing an object accessor that is not subclass of DataObject!');
          return {};
        }

        return {
          as: (alias) => {
            Object.defineProperty(this, alias, {
              configurable: false,
              enumerable: true,
              get: () => {
                return new ClassDefinition(this.get(path), ...constructorArgs);
              },
              set: (value) => {
                if (value instanceof ClassDefinition) {
                  this.set(path, value.__data);
                } else {
                  console.warn('Refused to update property', path, 'because it\'s not of type managed class type!');
                }
              }
            });
          }

        };
      }

    };
  }

  /**
   * Path-based getter with custom class constructor
   *
   * @param {string} path - The path in the object for which to get a value
   * @param {function} ClassDefinition - The class to instantiate, passing the value of the property at given path
   * @returns {any} - The value at the given path
   */
  getWithClass(path, ClassDefinition) {
    return walk(path, this.__data, function (obj, key) {
      return new ClassDefinition(obj[key]);
    }, true);
  };

  /**
   * Path-based getter
   *
   * @param {string} path - The path in the object for which to get a value
   * @returns {any} - The value at the given path
   */
  get(path) {
    if (path == null) {
      return this.__data;
    }
    return walk(path, this.__data, function (obj, key) {
      return obj[key];
    }, true);
  }

  /**
   * Path-based setter
   *
   * @param {string} path - The path in the object for which to set a value
   * @param {any} value - The value to set on that property
   */
  set(path, value) {
    walk(path, this.__data, function (obj, key) {
      obj[key] = value;
    }, false);
  }

  /**
   * Path-based remove
   *
   * @param {string} path - The path in the object to remove
   */
  remove(path) {
    walk(path, this.__data, function (obj, key) {
      if (obj[key] !== undefined) {
        delete obj[key];
      }
    }, false);
  }

  /**
   * JSON Serialization funciton
   *
   * This function will serialize the underlaying `__data` object into
   * a JSON string.
   *
   * @returns {string} - The serialized underlaying data
   */
  toJSON() {
    return this.__data;
  }

}

module.exports = DataObject;
