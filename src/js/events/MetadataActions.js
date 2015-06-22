var $ = require("jquery");

var ActionTypes = require("../constants/ActionTypes");
var AppDispatcher = require("./AppDispatcher");
var Config = require("../config/Config");

var MetadataActions = {

  fetch: function () {
    $.ajax({
      url: Config.rootUrl + "/metadata",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "GET",
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_METADATA,
          data: response
        });
      }
    });
  }

};

module.exports = MetadataActions;
