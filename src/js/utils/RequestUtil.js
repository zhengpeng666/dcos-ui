var $ = require("jquery");
var _ = require("underscore");

var Config = require("../config/Config");

let activeRequests = {};

function createCallbackWrapper(callback, requestID) {
  return function () {
    setRequestState(requestID, false);

    if (_.isFunction(callback)) {
      callback.apply(null, arguments);
    }
  };
}

function isRequestActive(requestID) {
  return activeRequests.hasOwnProperty(requestID) &&
    activeRequests[requestID] === true;
}

function setRequestState(requestID, state) {
  activeRequests[requestID] = state;
}

var RequestUtil = {
  json: function (options) {
    if (options && _.isFunction(options.hangingRequestCallback)) {
      let requestID = JSON.stringify(options);
      options.success = createCallbackWrapper(options.success, requestID);
      options.error = createCallbackWrapper(options.error, requestID);

      if (isRequestActive(requestID)) {
        options.hangingRequestCallback();
        return;
      } else {
        setRequestState(requestID, true);
        delete options.hangingRequestCallback;
      }
    }

    options = _.extend({}, {
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      timeout: Config.getRefreshRate(),
      type: "GET"
    }, options);

    /* eslint-disable consistent-return */
    return $.ajax(options);
    /* eslint-enable consistent-return */
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

      /* eslint-disable consistent-return */
      return callback.apply(options.context, arguments);
      /* eslint-enable consistent-return */
    };
  }
};

module.exports = RequestUtil;
