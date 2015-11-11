import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "./AppDispatcher";
import Config from "../config/Config";
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
var fetchConfig = RequestUtil.debounceOnError(
  Config.getRefreshRate(),
  function (resolve, reject) {
    return function () {
      RequestUtil.json({
        url: "BIG_FUCKING_QUESTION_MARK",
        success: function (response) {
          AppDispatcher.handleServerAction({
            type: ActionTypes.REQUEST_CONFIG_SUCCESS,
            data: response
          });
          resolve();
        },
        error: function (e) {
          AppDispatcher.handleServerAction({
            type: ActionTypes.REQUEST_CONFIG_ERROR,
            data: e.message
          });
          reject();
        }
      });
    };
  },
  {delayAfterCount: Config.delayAfterErrorCount}
);

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
