var ActionTypes = require("../constants/ActionTypes");
var AppDispatcher = require("./AppDispatcher");

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
  }
};

module.exports = SidebarActions;
