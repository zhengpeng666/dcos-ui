var _ = require("underscore");

const StringUtil = {
  filterByString: function (objects, key, searchString) {
    var searchPattern = new RegExp(StringUtil.escapeForRegExp(searchString), "i");

    return _.filter(objects, function (obj) {
      return searchPattern.test(obj[key]);
    });
  },

  escapeForRegExp: function (str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  },

  pluralize: function (string, arity) {
    if (arity == null) {
      arity = 2;
    }

    if (string.length === 0) {
      return "";
    }

    arity = parseInt(arity, 10);

    if (arity !== 1) {
      string = string.replace(/y$/, "ie") + "s";
    }

    return string;
  }
};

module.exports = StringUtil;
