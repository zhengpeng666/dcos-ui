var _ = require("underscore");
var $ = require("jquery");

var ActionTypes = require("../constants/ActionTypes");
var AppDispatcher = require("./AppDispatcher");
var Config = require("../config/Config");

function request(url, type, data, options) {
  options = _.extend({
    url: url,
    dataType: "json",
    type: type
  }, options);

  // make request
  $.ajax(options);
}

var MesosStateActions = {
  fetch: function () {
    var url = Config.rootUrl + "/master/state.json?jsonp=?";

    request(url, "GET", null, {
        contentType: "application/json; charset=utf-8",
        dataType: "jsonp",
        success: function (response) {
          AppDispatcher.handleServerAction({
            type: ActionTypes.REQUEST_MESOS_STATE_SUCCESS,
            data: response
          });
        },
        error: function (e) {
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
      contentType: "application/json; charset=utf-8",
      crossDomain: true,
      xhrFields: {
        withCredentials: false
      },
      dataType: "json",
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_MARATHON_APPS_SUCCESS,
          data: response
        });
      },
      error: function (e) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_MARATHON_APPS_ERROR,
          data: e.message
        });
      }
    });
  }
};

module.exports = MesosStateActions;
