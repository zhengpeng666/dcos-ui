var ActionTypes = require("../constants/ActionTypes");
var AppDispatcher = require("../dispatcher/AppDispatcher");
var API_ROOT = "http://10.141.141.10:5050/master/state.json";
var $ = require("jquery");

var MesosStateActions = {
  fetch: function () {
    var url = API_ROOT + "?jsonp=?";

    $.getJSON(url, function (response) {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_MESOS_STATE,
        data: response
      });
    });
  }
};

module.exports = MesosStateActions;
