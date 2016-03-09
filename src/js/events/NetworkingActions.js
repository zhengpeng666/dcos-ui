import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from './AppDispatcher';
import Config from '../config/Config';
import RequestUtil from '../utils/RequestUtil';

let NetworkingActions = {

  fetchVIPSummaries: function () {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.networkingAPIPrefix}/summary`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_NETWORKING_VIP_SUMMARIES_SUCCESS,
          data: response.array
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_NETWORKING_VIP_SUMMARIES_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr)
        });
      }
    });
  }

};

if (Config.useFixtures) {
  let vipSummariesFixture = require('../../../tests/_fixtures/networking/networking-vip-summaries.json');

  if (!global.actionTypes) {
    global.actionTypes = {};
  }

  if (!global.actionTypes.NetworkingActions) {
    global.actionTypes.NetworkingActions = {};
  }

  global.actionTypes.NetworkingActions.fetchVIPSummaries = {event: 'success', success: {response: vipSummariesFixture}};

  Object.keys(global.actionTypes.NetworkingActions).forEach(function (method) {
    NetworkingActions[method] = RequestUtil.stubRequest(
      NetworkingActions, 'NetworkingActions', method
    );
  });
}

module.exports = NetworkingActions;
