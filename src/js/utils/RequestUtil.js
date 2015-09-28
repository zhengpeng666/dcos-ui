var $ = require("jquery");
var _ = require("underscore");

var AppDispatcher = require("../events/AppDispatcher");
var Config = require("../config/Config");

let currentOngoingRequests = {};

let jsonCallbackWrapper = function (callback, url) {
  return function (response) {
    currentOngoingRequests[url] = false;

    if (_.isFunction(callback)) {
      callback(response);
    }
  };
};

let wrapJsonCallbacks = function (options) {
  let url = options.url;

  options.success = jsonCallbackWrapper(options.success, url);
  options.error = jsonCallbackWrapper(options.error, url);
};

let requestOngoing = function (url, ongoingRequests) {
  if (!url) {
    return false;
  }

  return ongoingRequests.hasOwnProperty(url) && ongoingRequests[url] === true;
};

var RequestUtil = {
  json: function (options, ongoingType) {
    options = options || {};
    if (requestOngoing(options.url, currentOngoingRequests)) {
      AppDispatcher.handleServerAction({
        type: ongoingType
      });
      return;
    }

    currentOngoingRequests[options.url] = true;
    wrapJsonCallbacks(options, currentOngoingRequests);

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
