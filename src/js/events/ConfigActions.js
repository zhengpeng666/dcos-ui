import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "./AppDispatcher";
import RequestUtil from "../utils/RequestUtil";

const ConfigActions = {
  fetchConfig: function () {
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
  }
};

const FIXTURE = {
  "uiConfig": {
    "plugins": {
      "tracking": {
        "enabled": true
      }
    }
  }
};
let useFixtures = true;

if (useFixtures) {
  ConfigActions.fetchConfig = function () {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_CONFIG_SUCCESS,
      data: FIXTURE
    });
  };
}

export default ConfigActions;
