var _ = require("underscore");
var $ = require("jquery");

var ActionTypes = require("../constants/ActionTypes");
var AppDispatcher = require("../dispatcher/AppDispatcher");
var Config = require("../utils/Config");

function request(url, type, data, options) {
  options = _.extend({
    url: url,
    dataType: "json",
    type: type
  }, options);


  if (data == null && options.contentType == null) { // don't send data
    options.contentType = "text/plain";
  } else if (options.contentType == null) { // send data
    options.contentType = "application/json; charset=utf-8";
    options.data = JSON.stringify(data);
  }

  // make request
  $.ajax(options);
}

var MesosStateActions = {
  fetch: function () {
    var url = Config.rootUrl + "/master/state.json?jsonp=?";

    request(url, "GET", null, {
        jsonpCallback: "mesosStateCallback",
        contentType: "application/json",
        dataType: "jsonp",
        success: function (response) {
          AppDispatcher.handleServerAction({
            type: ActionTypes.REQUEST_MESOS_STATE_SUCCESS,
            data: response
          });
        },
        error: function(e) {
           AppDispatcher.handleServerAction({
            type: ActionTypes.REQUEST_MESOS_STATE_ERROR,
            data: e.message
          });
        }
    });
  },

  fetchMarathonHealth: function (rootUrl) {
    var url = rootUrl + "/v2/apps";

    request(url, "GET", null, {
      jsonpCallback: "marathonHealthCallback",
      contentType: "application/json",
      crossDomain: true,
      xhrFields: {
        withCredentials: false
      },
      dataType: "json",
      success: function(response) {
         AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_MARATHON_HEALTH_SUCCESS,
          data: response
        });
      },
      error: function(e) {
         AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_MARATHON_HEALTH_ERROR,
          data: e.message
        });
      }
    });
  }
};

module.exports = MesosStateActions;
