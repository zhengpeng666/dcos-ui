var $ = require("jquery");
var _ = require("underscore");

var Config = require("../config/Config");

var RequestUtil = {
  json: function (options) {
    options = _.extend({}, {
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      timeout: Config.stateRefresh,
      type: "GET"
    }, options);

    $.ajax(options);
  }
};

module.exports = RequestUtil;
