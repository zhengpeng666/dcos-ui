var $ = require("jquery");
var _ = require("underscore");

var AppDispatcher = require("../events/AppDispatcher");
var Config = require("../config/Config");

let activeRequests = {};

let createCallbackWrapper = function (callback, url) {
  return function () {
    activeRequests[url] = false;

    if (_.isFunction(callback)) {
      callback.apply(null, arguments);
    }
  };
};

var RequestUtil = {
  isRequestActive: function (requestID) {
    if (!requestID) {
      return false;
    }

    return activeRequests.hasOwnProperty(requestID) &&
      activeRequests[requestID] === true;
  },

  json: function (options, ongoingType) {
    if (ongoingType) {
      let requestID = JSON.stringify(options);
      options.success = createCallbackWrapper(options.success, options.url);
      options.error = createCallbackWrapper(options.error, options.url);

      if (this.isRequestActive(requestID)) {
        AppDispatcher.handleServerAction({type: ongoingType});
        return;
      } else {
        activeRequests[requestID] = true;
      }
    }

    options = _.extend({}, {
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      timeout: Config.getRefreshRate(),
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
