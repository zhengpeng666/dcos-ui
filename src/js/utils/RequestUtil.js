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

  debounceOnError: function (interval, promiseFn, options) {
    var rejectionCount = 0;
    var timeUntilNextCall = 0;
    var currentInterval = interval;
    options = options || {};

    if (!_.isNumber(options.delayAfterCount)) {
      options.delayAfterCount = 0;
    }

    function resolveFn() {
      rejectionCount = 0;
      timeUntilNextCall = 0;
      currentInterval = interval;
    }

    function rejectFn() {
      rejectionCount++;

      // Only delay if after delayAfterCount requests have failed
      if (rejectionCount >= options.delayAfterCount) {
        // Exponentially increase the time till the next call
        currentInterval *= 2;
        timeUntilNextCall = Date.now() + currentInterval;
      }
    }

    var callback = promiseFn(resolveFn, rejectFn);

    return function () {
      if (Date.now() < timeUntilNextCall) {
        return;
      }

      callback.apply(options.context, arguments);
    };
  }
};

module.exports = RequestUtil;
