var ActionTypes = require("../constants/ActionTypes");
var AppDispatcher = require("./AppDispatcher");

var SidebarActions = {
  open: function () {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_SIDEBAR_OPEN,
      data: true
    });
  },

  close: function () {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_SIDEBAR_CLOSE,
      data: false
    });
  }
};

module.exports = SidebarActions;
