var Actions = require("../actions/Actions");
var ActionTypes = require("../constants/ActionTypes");
var AppDispatcher = require("./AppDispatcher");
var Config = require("../config/Config");
var RequestUtil = require("../utils/RequestUtil");

var _historyServiceOnline = true;

function getStateUrl(timeScale) {
  timeScale = timeScale || "last";
  if (_historyServiceOnline) {
    return Config.historyServer +
      "/dcos-history-service/history/" + timeScale;
  } else {
    return Config.rootUrl + "/mesos/master/state-summary";
  }
}

function registerServerError(message, type) {
  _historyServiceOnline = false;
  Actions.log({
    description: "Server error",
    type: type,
    error: message
  });
}

var MesosStateActions = {

  fetchSummary: RequestUtil.debounceOnError(
    Config.stateRefresh,
    function (resolve, reject) {
      return function (timeScale) {
        var successType = ActionTypes.REQUEST_MESOS_HISTORY_SUCCESS;
        var errorType = ActionTypes.REQUEST_MESOS_HISTORY_ERROR;

        if (timeScale == null) {
          successType = ActionTypes.REQUEST_MESOS_SUMMARY_SUCCESS;
          errorType = ActionTypes.REQUEST_MESOS_SUMMARY_ERROR;
        }

        var url = getStateUrl(timeScale);

        RequestUtil.json({
          url: url,
          success: function (response) {
            AppDispatcher.handleServerAction({
              type: successType,
              data: response
            });
            resolve();
          },
          error: function (e) {
            registerServerError(e.message, errorType);
            AppDispatcher.handleServerAction({
              type: errorType,
              data: e.message
            });
            reject();
          }
        });
      };
    }
  ),

  fetchState: RequestUtil.debounceOnError(
    Config.stateRefresh,
    function (resolve, reject) {
      return function () {
        var url = Config.historyServer + "/mesos/master/state.json";

        RequestUtil.json({
          url: url,
          success: function (response) {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_MESOS_STATE_SUCCESS,
              data: response
            });
            resolve();
          },
          error: function (e) {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_MESOS_STATE_ERROR,
              data: e.message
            });
            reject();
          }
        });
      };
    }
  ),

  fetchMarathonHealth: RequestUtil.debounceOnError(
    Config.stateRefresh,
    function (resolve, reject) {
      return function () {
        var url = Config.rootUrl + "/marathon/v2/apps";

        RequestUtil.json({
          url: url,
          success: function (response) {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_MARATHON_APPS_SUCCESS,
              data: response
            });
            resolve();
          },
          error: function (e) {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_MARATHON_APPS_ERROR,
              data: e.message
            });
            reject();
          }
        });
      };
    }
  )
};

module.exports = MesosStateActions;
