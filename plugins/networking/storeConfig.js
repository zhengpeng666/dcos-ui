// Users
import NetworkingBackendConnectionsStore from './stores/NetworkingBackendConnectionsStore';
import NetworkingNodeMembershipsStore from './stores/NetworkingNodeMembershipsStore';
import NetworkingVIPsStore from './stores/NetworkingVIPsStore';
import {
  NETWORKING_BACKEND_CONNECTIONS_CHANGE,
  NETWORKING_BACKEND_CONNECTIONS_REQUEST_ERROR,
  NETWORKING_NODE_MEMBERSHIP_CHANGE,
  NETWORKING_NODE_MEMBERSHIP_REQUEST_ERROR,
  NETWORKING_VIPS_CHANGE,
  NETWORKING_VIPS_REQUEST_ERROR,
  NETWORKING_VIP_DETAIL_CHANGE,
  NETWORKING_VIP_DETAIL_REQUEST_ERROR,
} from './constants/EventTypes';

let SDK = require('./SDK').getSDK();

module.exports = {
  register() {
    let StoreMixinConfig = SDK.get('StoreMixinConfig');

    StoreMixinConfig.add('networkingBackendConnections', {
      store: NetworkingBackendConnectionsStore,
      events: {
        success: NETWORKING_BACKEND_CONNECTIONS_CHANGE,
        error: NETWORKING_BACKEND_CONNECTIONS_REQUEST_ERROR
      },
      unmountWhen: function () {
        return true;
      },
      listenAlways: true
    });

    StoreMixinConfig.add('networkingNodeMemberships', {
      store: NetworkingNodeMembershipsStore,
      events: {
        success: NETWORKING_NODE_MEMBERSHIP_CHANGE,
        error: NETWORKING_NODE_MEMBERSHIP_REQUEST_ERROR
      },
      unmountWhen: function () {
        return true;
      },
      listenAlways: true
    });

    StoreMixinConfig.add('networkingVIPs', {
      store: NetworkingVIPsStore,
      events: {
        success: NETWORKING_VIPS_CHANGE,
        error: NETWORKING_VIPS_REQUEST_ERROR,
        detailSuccess: NETWORKING_VIP_DETAIL_CHANGE,
        detailError: NETWORKING_VIP_DETAIL_REQUEST_ERROR
      },
      unmountWhen: function () {
        return true;
      },
      listenAlways: true
    });
  }
};
