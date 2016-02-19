import {Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import EventTypes from '../constants/EventTypes';
import GetSetMixin from '../mixins/GetSetMixin';
import NetworkingActions from '../events/NetworkingActions';

let NetworkingVIPsStore = Store.createStore({
  storeID: 'networkingVIPs',

  mixins: [GetSetMixin],

  getSet_data: {
    vips: [],
    vipDetail: {}
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  fetchVIPs: NetworkingActions.fetchVIPs,

  fetchVIPDetail: NetworkingActions.fetchVIPDetail,

  processVIPs: function (vips) {
    this.set({vips});
    this.emit(EventTypes.NETWORKING_VIPS_CHANGE);
  },

  processVIPsError: function (error) {
    this.emit(EventTypes.NETWORKING_VIPS_REQUEST_ERROR, error);
  },

  processVIPDetail: function (vip, vipDetail) {
    let currentVIPDetail = this.get('vipDetail');
    currentVIPDetail[vip] = vipDetail;
    this.set({vipDetail: currentVIPDetail});
    this.emit(EventTypes.NETWORKING_VIP_DETAIL_CHANGE, vip);
  },

  processVIPDetailError: function (vip, error) {
    this.emit(EventTypes.NETWORKING_VIP_DETAIL_REQUEST_ERROR, vip, error);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    if (payload.source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    let action = payload.action;
    switch (action.type) {
      case ActionTypes.REQUEST_NETWORKING_VIPS_SUCCESS:
        NetworkingVIPsStore.processVIPs(action.data);
        break;
      case ActionTypes.REQUEST_NETWORKING_VIPS_ERROR:
        NetworkingVIPsStore.processVIPsError(action.data);
        break;
      case ActionTypes.REQUEST_NETWORKING_VIP_DETAIL_SUCCESS:
        NetworkingVIPsStore.processVIPDetail(action.vip, action.data);
        break;
      case ActionTypes.REQUEST_NETWORKING_VIP_DETAIL_ERROR:
        NetworkingVIPsStore.processVIPDetailError(action.vip, action.data);
        break;
    }

    return true;
  })

});

module.exports = NetworkingVIPsStore;
