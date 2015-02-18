var ActionTypes = require("../constants/ActionTypes");
var AppDispatcher = require("../dispatcher/AppDispatcher");

var ServicesFilterActions = {
  setFilterString: function (filterString) {
    AppDispatcher.dispatch({
      action: {
        type: ActionTypes.FILTER_SERVICES_BY_STRING,
        data: filterString
      }
    });
  }
};

module.exports = ServicesFilterActions;
