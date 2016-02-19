import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from './AppDispatcher';
import Config from '../config/Config';
import RequestUtil from '../utils/RequestUtil';

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

module.exports = NetworkingActions;
