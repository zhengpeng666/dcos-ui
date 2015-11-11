import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "./AppDispatcher";
import RequestUtil from "../utils/RequestUtil";

var FIXTURE = {
  "uiConfig": {
    "plugins": {
      "banner": {
        "bgColor": "#999",
        "content": "This is confidential",
        "alignment": "center"
      }
    }
  }
};

var useFixtures = true;
var fetchConfig = function () {
  RequestUtil.json({
    url: "BIG_FUCKING_QUESTION_MARK",
    success: function (response) {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_CONFIG_SUCCESS,
        data: response
      });
    },
    error: function (e) {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_CONFIG_ERROR,
        data: e.message
      });
    }
  });
};

if (useFixtures) {
  fetchConfig = function () {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_CONFIG_SUCCESS,
      data: FIXTURE
    });
  };
}

const ConfigActions = {
  fetchConfig
};

export default ConfigActions;
