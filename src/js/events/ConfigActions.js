import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "./AppDispatcher";
import Config from "../config/Config";
import RequestUtil from "../utils/RequestUtil";

const ConfigActions = {
  fetchConfig: function () {
    let configFixture = Config.uiConfigurationFixture;
    if (configFixture) {
      AppDispatcher.handleServerAction({
        type: ActionTypes.REQUEST_CONFIG_SUCCESS,
        data: configFixture
      });

      return;
    }

    RequestUtil.json({
      url: `${Config.rootUrl}/dcos-metadata/ui-config.json`,
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

export default ConfigActions;
