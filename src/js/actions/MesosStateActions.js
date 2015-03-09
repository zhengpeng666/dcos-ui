var $ = require("jquery");

var ActionTypes = require("../constants/ActionTypes");
var AppDispatcher = require("../dispatcher/AppDispatcher");
var Config = require("../utils/Config");

var MesosStateActions = {
  fetch: function () {
    var url = Config.rootUrl + "/master/state.json?jsonp=?";

    $.getJSON(url, function (response) {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_MESOS_STATE,
        data: response
      });
    });
  }
};

module.exports = MesosStateActions;
