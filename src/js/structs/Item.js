function prune(pruneValues, obj) {
  if ((typeof obj !== 'object') || (obj == null)) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj
      .filter(function (value) {
        return !pruneValues.some(function (testValue) {
          return value === testValue;
        });
      })
      .map(prune.bind({}, pruneValues));
  }

  return Object.keys(obj).reduce(function (newObj, key) {
    let value = obj[key];
    let pruneThis = pruneValues.some(function (testValue) {
      return value === testValue;
    });

    if (pruneThis) {
      return newObj;
    }

    newObj[key] = prune(pruneValues, value);
    return newObj;
  }, {});
}

module.exports = class Item {
  constructor(item = {}) {
    Object.keys(item).forEach(function (key) {
      this[key] = item[key];
    }, this);

    this._itemData = item;
  }

  get(key) {
    if (key == null) {
      return this._itemData;
    }

    return this._itemData[key];
  }

  getPruned(key, pruneValues=[null, undefined]) {
    return prune(pruneValues, this.get(key));
  }

  toJSON() {
    return this.get();
  }
};
