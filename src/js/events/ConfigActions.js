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
      },
      "banner": {
        "backgroundColor": "red",
        "foregroundColor": "white",
        "headerTitle": "tester",
        "headerContent": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        "footerContent": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        "imagePath": "./img/services/icon-service-marathon-small@2x.png",
        "dismissible": "false"
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
