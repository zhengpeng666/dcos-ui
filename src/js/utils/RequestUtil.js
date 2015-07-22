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
  },

  debounceOnError: function(interval, promiseFn, context) {
    var rejectionCount = 0;
    var timeUntilNextCall = 0;

    function resolveFn() {
      rejectionCount = 0;
      timeUntilNextCall = 0;
    }

    function rejectFn() {
      rejectionCount++;
      var delay = 0;
      // only delay if after 3 requests have failed
      if (rejectionCount > 2) {
        delay = rejectionCount;
      }

      timeUntilNextCall = Date.now() + (delay * interval);
    }

    var callback = promiseFn(resolveFn, rejectFn);

    return function () {
      if (Date.now() < timeUntilNextCall) {
        return;
      }

      callback.apply(context, arguments);
    };
  }
};

module.exports = RequestUtil;
