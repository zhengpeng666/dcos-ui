import marked from 'marked';

const StringUtil = {
  filterByString: function (objects, getter, searchString) {
    var regex = StringUtil.escapeForRegExp(searchString);
    var searchPattern = new RegExp(regex, 'i');

    if (typeof getter === 'function') {
      return objects.filter(function (obj) {
        return searchPattern.test(getter(obj));
      });
    }

    return objects.filter(function (obj) {
      return searchPattern.test(obj[getter]);
    });
  },

  escapeForRegExp: function (str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  },

  isUrl: function (str) {
    return !!str && /^https?:\/\/.+/.test(str);
  },

  isEmail: function (str) {
    // https://news.ycombinator.com/item?id=8360786
    return !!str &&
      str.length > 3 &&
      str.indexOf('@') !== -1 &&
      str.indexOf('.') !== -1;
  },

  pluralize: function (string, arity) {
    if (arity == null) {
      arity = 2;
    }

    if (string.length === 0) {
      return '';
    }

    arity = parseInt(arity, 10);

    if (arity !== 1) {
      string = string.replace(/y$/, 'ie') + 's';
    }

    return string;
  },

  capitalize: function (string) {
    if (typeof string !== 'string') {
      return null;
    }

    return string.charAt(0).toUpperCase() + string.slice(1, string.length);
  },

  parseMarkdown(text) {
    let __html = marked(
      // Remove any tabs, that will create code blocks
      text.replace('\t', ' '),
      {gfm: true, tables: false, sanitize: true}
    );

    if (!__html) {
      return null;
    }

    return {__html};
  }
};

module.exports = StringUtil;
