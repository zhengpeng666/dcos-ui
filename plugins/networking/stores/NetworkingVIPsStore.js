import {
  NETWORKING_VIPS_CHANGE,
  NETWORKING_VIPS_REQUEST_ERROR,
  NETWORKING_VIP_DETAIL_CHANGE,
  NETWORKING_VIP_DETAIL_REQUEST_ERROR,
} from '../constants/EventTypes';

import {
  REQUEST_NETWORKING_VIPS_SUCCESS,
  REQUEST_NETWORKING_VIPS_ERROR,
  REQUEST_NETWORKING_VIP_DETAIL_SUCCESS,
  REQUEST_NETWORKING_VIP_DETAIL_ERROR
} from '../constants/ActionTypes';

import NetworkingActions from '../actions/NetworkingActions';
import VIPDetail from '../structs/VIPDetail';

let SDK = require('../SDK').getSDK();
let fetchVIPDetailInterval = null;
const VIPDetailLoadInterval = 1000 * 60; // Once a minute

let NetworkingVIPsStore = SDK.createStore({
  storeID: 'networkingVIPs',

  mixinEvents: {
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
  },

  startFetchVIPDetail: function (protocol, vip, port) {
    if (fetchVIPDetailInterval) {
      return;
    }

    NetworkingActions.fetchVIPDetail(protocol, vip, port);
    fetchVIPDetailInterval = global.setInterval(function () {
      NetworkingActions.fetchVIPDetail(protocol, vip, port);
    }, VIPDetailLoadInterval);
  },

  stopFetchVIPDetail: function () {
    if (fetchVIPDetailInterval) {
      global.clearInterval(fetchVIPDetailInterval);
      fetchVIPDetailInterval = null;
    }
  },

  fetchVIPs: NetworkingActions.fetchVIPs,

  get(prop) {
    return SDK.Store.getOwnState()[prop];
  },

  getVIPDetail: function (vipString) {
    let vipDetail = this.get('vipDetail')[vipString];

    if (vipDetail) {
      return new VIPDetail(vipDetail);
    }

    return null;
  },

  processVIPs: function (vips) {
    SDK.dispatch({
      type: NETWORKING_VIPS_CHANGE,
      vips
    });
    this.emit(NETWORKING_VIPS_CHANGE);
  },

  processVIPsError: function (error) {
    this.emit(NETWORKING_VIPS_REQUEST_ERROR, error);
  },

  processVIPDetail: function (vip, vipDetail) {
    let currentVIPDetail = this.get('vipDetail');
    currentVIPDetail[vip] = vipDetail;
    SDK.dispatch({
      type: NETWORKING_VIP_DETAIL_CHANGE,
      vipDetail: currentVIPDetail
    });
    this.emit(NETWORKING_VIP_DETAIL_CHANGE, vip);
  },

  processVIPDetailError: function (vip, error) {
    this.emit(NETWORKING_VIP_DETAIL_REQUEST_ERROR, vip, error);
  }
});

SDK.onDispatch(function (action) {
  switch (action.type) {
    case REQUEST_NETWORKING_VIPS_SUCCESS:
      NetworkingVIPsStore.processVIPs(action.data);
      break;
    case REQUEST_NETWORKING_VIPS_ERROR:
      NetworkingVIPsStore.processVIPsError(action.data);
      break;
    case REQUEST_NETWORKING_VIP_DETAIL_SUCCESS:
      NetworkingVIPsStore.processVIPDetail(action.vip, action.data);
      break;
    case REQUEST_NETWORKING_VIP_DETAIL_ERROR:
      NetworkingVIPsStore.processVIPDetailError(action.vip, action.data);
      break;
  }
});

module.exports = NetworkingVIPsStore;
