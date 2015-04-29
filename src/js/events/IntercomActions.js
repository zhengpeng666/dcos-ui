var ActionTypes = require("../constants/ActionTypes");
var AppDispatcher = require("./AppDispatcher");

var SidebarActions = {

  open: function () {
    AppDispatcher.handleIntercomAction({
      type: ActionTypes.REQUEST_INTERCOM_OPEN,
      data: true
    });
  },

  close: function () {
    AppDispatcher.handleIntercomAction({
      type: ActionTypes.REQUEST_INTERCOM_CLOSE,
      data: false
    });
  }
};

module.exports = SidebarActions;
