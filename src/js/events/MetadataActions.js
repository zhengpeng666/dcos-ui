var _ = require("underscore");
var $ = require("jquery");

var Actions = require("../actions/Actions");
var ActionTypes = require("../constants/ActionTypes");
var AppDispatcher = require("./AppDispatcher");
var Config = require("../config/Config");

var MetadataActions = {

  fetch: function () {
    $.ajax({
        url: Config.rootUrl + "/metadata",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
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
