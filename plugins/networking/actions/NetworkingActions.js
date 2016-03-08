import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../../../src/js/events/AppDispatcher';
import Config from '../../../src/js/config/Config';
import RequestUtil from '../../../src/js/utils/RequestUtil';

let NetworkingActions = {

  fetchVIPs: function () {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.networkingAPIPrefix}/vips`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_NETWORKING_VIPS_SUCCESS,
          data: response.array
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_NETWORKING_VIPS_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr)
        });
      }
    });
  },

  fetchVIPDetail: function (protocol, vip, port) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.networkingAPIPrefix}/${vip}/${protocol}/${port}`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_NETWORKING_VIP_DETAIL_SUCCESS,
          data: response,
          vip: `${protocol}:${vip}:${port}`
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_NETWORKING_VIP_DETAIL_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          vip: `${protocol}:${vip}:${port}`
        });
      }
    });
  },

  fetchVIPBackendConnections: function (protocol, vip, port) {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.networkingAPIPrefix}/backend-connections/${vip}/${protocol}/${port}`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_NETWORKING_BACKEND_CONNECTIONS_SUCCESS,
          data: response,
          vip: `${protocol}:${vip}:${port}`
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_NETWORKING_BACKEND_CONNECTIONS_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          vip: `${protocol}:${vip}:${port}`
        });
      }
    });
  },

  fetchNodeMemberships: function () {
    RequestUtil.json({
      url: `${Config.rootUrl}${Config.networkingAPIPrefix}/membership`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_NETWORKING_NODE_MEMBERSHIPS_SUCCESS,
          data: response.array
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_NETWORKING_NODE_MEMBERSHIPS_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr)
        });
      }
    });
  }

};

if (Config.useFixtures) {
  let backendConnectionsFixture = require('../../../tests/_fixtures/networking/networking-backend-connections.json');
  let nodeMembershipsFixture = require('../../../tests/_fixtures/networking/networking-node-memberships.json');
  let vipDetailFixture = require('../../../tests/_fixtures/networking/networking-vip-detail.json');
  let vipsFixture = require('../../../tests/_fixtures/networking/networking-vips.json');

  if (!global.actionTypes) {
    global.actionTypes = {};
  }

  if (!global.actionTypes.NetworkingActions) {
    global.actionTypes.NetworkingActions = {};
  }

  global.actionTypes.NetworkingActions.fetchVIPs = {event: 'success', success: {response: vipsFixture}};
  global.actionTypes.NetworkingActions.fetchVIPDetail = {event: 'success', success: {response: vipDetailFixture}};
  global.actionTypes.NetworkingActions.fetchVIPBackendConnections = {event: 'success', success: {response: backendConnectionsFixture}};
  global.actionTypes.NetworkingActions.fetchNodeMemberships = {event: 'success', success: {response: nodeMembershipsFixture}};

  Object.keys(global.actionTypes.NetworkingActions).forEach(function (method) {
    NetworkingActions[method] = RequestUtil.stubRequest(
      NetworkingActions, 'NetworkingActions', method
    );
  });
}

module.exports = NetworkingActions;
