var $ = require("jquery");

var ActionTypes = require("../constants/ActionTypes");
var AppDispatcher = require("./AppDispatcher");
var Config = require("../config/Config");

var SidebarActions = {

  open: function () {
    AppDispatcher.handleSidebarAction({
      type: ActionTypes.REQUEST_SIDEBAR_OPEN,
      data: true
    });
  },

  close: function () {
    AppDispatcher.handleSidebarAction({
      type: ActionTypes.REQUEST_SIDEBAR_CLOSE,
      data: false
    });
  },

  openCliInstructions: function () {
    AppDispatcher.handleSidebarAction({
      type: ActionTypes.REQUEST_CLI_INSTRUCTIONS,
      data: false
    });
  },

  startTour: function () {
    AppDispatcher.handleSidebarAction({
      type: ActionTypes.REQUEST_TOUR_START,
      data: false
    });
  },

  showVersions: function () {
    var host = Config.rootUrl.replace(/:[0-9]{0,4}$/, "");
    var url = host + "/pkgpanda/active.buildinfo.full.json";

    $.ajax({
      url: url,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "GET",
      success: function (response) {
        AppDispatcher.handleSidebarAction({
          type: ActionTypes.REQUEST_VERSIONS_SUCCESS,
          data: response
        });
      },
      error: function (e) {
        AppDispatcher.handleSidebarAction({
          type: ActionTypes.REQUEST_VERSIONS_ERROR,
          data: e.message
        });
      }
    });
  }

};

module.exports = SidebarActions;
