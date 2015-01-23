var Dispatcher = require("flux").Dispatcher;
var _ = require("underscore");

var AppDispatcher = _.extend(new Dispatcher(), {

  handleServerAction: function (action) {
    if (!action.type) {
      console.warn("Empty action.type: you likely mistyped the action.");
    }

    this.dispatch({
      source: "SERVER_ACTION",
      action: action
    });
  }
});

module.exports = AppDispatcher;
