import {Store} from 'mesosphere-shared-reactjs';

import AppDispatcher from '../events/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import EventTypes from '../constants/EventTypes';
import GetSetMixin from '../mixins/GetSetMixin';
import NetworkingActions from '../events/NetworkingActions';

var NetworkingStore = Store.createStore({
  storeID: 'networking',

  mixins: [GetSetMixin],

  getSet_data: {
    backendConnections: {},
    nodeMemberships: [],
    vips: [],
    vipDetail: {},
    vipSummaries: []
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  fetchVIPs: NetworkingActions.fetchVIPs,

  fetchVIPSummaries: NetworkingActions.fetchVIPSummaries,

  fetchVIPDetail: NetworkingActions.fetchVIPDetail,

  fetchVIPBackendConnections: NetworkingActions.fetchVIPBackendConnections,

  fetchNodeMemberships: NetworkingActions.fetchNodeMemberships,

  processVIPs: function (vips) {
    this.set('vips', vips);
    this.emit(EventTypes.NETWORKING_VIPS_CHANGE);
  },

  processVIPsError: function (error) {
    this.emit(EventTypes.NETWORKING_VIPS_REQUEST_ERROR, error);
  },

  processVIPSummaries: function (vipSummaries) {
    this.set('vipSummaries', vipSummaries);
    this.emit(EventTypes.NETWORKING_VIP_SUMMARIES_CHANGE);
  },

  processVIPSummariesError: function (error) {
    this.emit(EventTypes.NETWORKING_VIP_SUMMARIES_ERROR, error);
  },

  processVIPDetail: function (vip, vipDetail) {
    let currentVIPDetail = this.get('vipDetail');
    currentVIPDetail[vip] = vipDetail;
    this.set('vipDetail', currentVIPDetail);
    this.emit(EventTypes.NETWORKING_VIP_DETAIL_CHANGE, vip);
  },

  processVIPDetailError: function (vip, error) {
    this.emit(EventTypes.NETWORKING_VIP_DETAIL_REQUEST_ERROR, vip, error);
  },

  processBackendConnections: function (vip, backendConnections) {
    let currentBackendConnections = this.get('backendConnections');
    currentBackendConnections[vip] = backendConnections;
    this.set('backendConnections', currentBackendConnections);
    this.emit(EventTypes.NETWORKING_BACKEND_CONNECTIONS_CHANGE, vip);
  },

  processBackendConnectionsError: function (vip, error) {
    this.emit(EventTypes.NETWORKING_BACKEND_CONNECTIONS_REQUEST_ERROR, error, vip);
  },

  processNodeMemberships: function (nodeMemberships) {
    this.set('nodeMemberships', nodeMemberships);
    this.emit(EventTypes.NETWORKING_NODE_MEMBERSHIP_CHANGE);
  },

  processNodeMembershipsError: function (error) {
    this.emit(EventTypes.NETWORKING_NODE_MEMBERSHIP_REQUEST_ERROR, error);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    if (payload.source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    let action = payload.action;
    switch (action.type) {
      case ActionTypes.REQUEST_NETWORKING_VIPS_SUCCESS:
        NetworkingStore.processVIPs(action.data);
        break;
      case ActionTypes.REQUEST_NETWORKING_VIPS_ERROR:
        NetworkingStore.processVIPsError(action.data);
        break;
      case ActionTypes.REQUEST_NETWORKING_VIP_SUMMARIES_SUCCESS:
        NetworkingStore.processVIPSummaries(action.data);
        break;
      case ActionTypes.REQUEST_NETWORKING_VIP_SUMMARIES_ERROR:
        NetworkingStore.processVIPSummariesError(action.data);
        break;
      case ActionTypes.REQUEST_NETWORKING_VIP_DETAIL_SUCCESS:
        NetworkingStore.processVIPDetail(action.vip, action.data);
        break;
      case ActionTypes.REQUEST_NETWORKING_VIP_DETAIL_ERROR:
        NetworkingStore.processVIPDetailError(action.vip, action.data);
        break;
      case ActionTypes.REQUEST_NETWORKING_BACKEND_CONNECTIONS_SUCCESS:
        NetworkingStore.processBackendConnections(action.vip, action.data);
        break;
      case ActionTypes.REQUEST_NETWORKING_BACKEND_CONNECTIONS_ERROR:
        NetworkingStore.processBackendConnectionsError(action.vip, action.data);
        break;
      case ActionTypes.REQUEST_NETWORKING_NODE_MEMBERSHIPS_SUCCESS:
        NetworkingStore.processNodeMemberships(action.data);
        break;
      case ActionTypes.REQUEST_NETWORKING_NODE_MEMBERSHIPS_ERROR:
        NetworkingStore.processNodeMembershipsError(action.data);
        break;
    }

    return true;
  })

});

module.exports = NetworkingStore;
