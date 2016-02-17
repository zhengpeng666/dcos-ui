import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from './AppDispatcher';
import Config from '../config/Config';
import RequestUtil from '../utils/RequestUtil';

const ComponentHealthActions = {

  fetchComponents: function () {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.componentHealthAPIPrefix}/components`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_HEALTH_COMPONENTS_SUCCESS,
          data: response.array
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_HEALTH_COMPONENTS_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr)
        });
      }
    });
  },

  fetchReport: function () {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.componentHealthAPIPrefix}/report`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_HEALTH_REPORT_SUCCESS,
          data: response
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_HEALTH_REPORT_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr)
        });
      }
    });
  }
};

if (Config.useFixtures) {
  let componentsFixture = require('json!../../../tests/_fixtures/component-health/components.json');

  if (!global.actionTypes) {
    global.actionTypes = {};
  }

  global.actionTypes.ComponentHealthActions = {
    fetchComponents: {event: 'success', success: {response: componentsFixture}}
  };
}

module.exports = ComponentHealthActions;
