var Strings = {
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

    arity = parseInt(arity.length, 10);

    if (arity !== 1) {
      string = string.replace(/y$/, "ie") + "s";
    }

    return string;
  }
};

module.exports = Strings;
