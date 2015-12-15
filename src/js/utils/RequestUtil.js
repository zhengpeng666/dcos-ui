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
    if (options) {
      if (_.isFunction(options.hangingRequestCallback)) {
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

      if (options.type && options.type !== "GET" && options.data) {
        options.data = JSON.stringify(options.data);
        if (!options.dataType) {
          options.dataType = "text";
        }
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
  },

  /**
   * Allows overriding the response of an ajax request as well
   * as the success or failure of a request.
   *
   * @param  {Object} actionsHash The Actions file configuration
   * @param  {String} actionsHashName The actual name of the actions file
   * @param  {String} methodName The name of the method to be stubbed
   * @return {Function} A function
   */
  stubRequest: function (actionsHash, actionsHashName, methodName) {
    if (!global.actionTypes) {
      global.actionTypes = {};
    }

    // Cache the method we're stubbing
    let originalFunction = actionsHash[methodName];

    function closure() {
      // Store original RequestUtil.json
      let requestUtilJSON = RequestUtil.json;
      // `configuration` will contain the config that
      // is passed to RequestUtil.json
      let configuration = null;
      // The configuration for the given method, this should be set externally
      let methodConfig = global.actionTypes[actionsHashName][methodName];

      // Proxy calls to RequestUtil.json
      RequestUtil.json = function (object) {
        configuration = object;
      };

      // The event type that we'll call success/error for the ajax request
      let eventType = methodConfig.event;
      // This will cause `configuration` to be set
      originalFunction.apply(actionsHash, arguments);

      // Restore RequestUtil.json
      RequestUtil.json = requestUtilJSON;

      let response = {};

      if (methodConfig[eventType] && methodConfig[eventType].response) {
        response = methodConfig[eventType].response;
      } else if (eventType === "error") {
        response = {responseJSON: {error: "Some generic error"}};
      }

      configuration[eventType](response);
    }

    // Return a function so that we can use setTimeout in the end.
    return function (...args) {
      setTimeout(function () {
        closure.apply(null, args);
      }, global.actionTypes.requestTimeout || 500);
    };
  },

  parseResponseBody: function (xhr) {
    let responseText = xhr.responseText;
    if (responseText) {
      return JSON.parse(responseText);
    }

    return {};
  }
};

module.exports = RequestUtil;
