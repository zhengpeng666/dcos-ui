var Strings = {
  escapeForRegExp: function (str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }
};

module.exports = Strings;
