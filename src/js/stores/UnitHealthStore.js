import _ from 'underscore';
import {Store} from 'mesosphere-shared-reactjs';

import {
  SERVER_ACTION,
  REQUEST_HEALTH_UNITS_SUCCESS,
  REQUEST_HEALTH_UNITS_ERROR,
  REQUEST_HEALTH_UNIT_SUCCESS,
  REQUEST_HEALTH_UNIT_ERROR,
  REQUEST_HEALTH_UNIT_NODES_SUCCESS,
  REQUEST_HEALTH_UNIT_NODES_ERROR,
  REQUEST_HEALTH_UNIT_NODE_SUCCESS,
  REQUEST_HEALTH_UNIT_NODE_ERROR
} from '../constants/ActionTypes';
import {
  HEALTH_UNIT_SUCCESS,
  HEALTH_UNIT_ERROR,
  HEALTH_UNIT_NODES_SUCCESS,
  HEALTH_UNIT_NODES_ERROR,
  HEALTH_UNIT_NODE_SUCCESS,
  HEALTH_UNIT_NODE_ERROR,
  HEALTH_UNITS_ERROR,
  HEALTH_UNITS_CHANGE
} from '../constants/EventTypes';
import AppDispatcher from '../events/AppDispatcher';
import UnitHealthActions from '../events/UnitHealthActions';
import HealthUnit from '../structs/HealthUnit';
import HealthUnitsList from '../structs/HealthUnitsList';
import GetSetMixin from '../mixins/GetSetMixin';
import Node from '../structs/Node';
import NodesList from '../structs/NodesList';

const UnitHealthStore = Store.createStore({

  storeID: 'unitHealth',

  mixins: [GetSetMixin],

  getSet_data: {
    units: [],
    unitsByID: {},
    nodesByID: {}
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  getUnits: function () {
    return new HealthUnitsList({
      items: this.get('units')
    });
  },

  getUnit: function (id) {
    return new HealthUnit(this.get('unitsByID')[id] || {});
  },

  getNodes: function (unitID) {
    let unit = this.get('unitsByID')[unitID] || [];
    return new NodesList({items: unit.nodes});
  },

  getNode: function (nodeID) {
    return new Node(this.get('nodesByID')[nodeID] || []);
  },

  getReport: function () {
    return this.get('report');
  },

  fetchUnits: UnitHealthActions.fetchUnits,

  fetchUnit: UnitHealthActions.fetchUnit,

  fetchUnitNodes: UnitHealthActions.fetchUnitNodes,

  fetchUnitNode: UnitHealthActions.fetchUnitNode,

  processUnits: function (units) {
    this.set({units});

    this.emit(HEALTH_UNITS_CHANGE);
  },

  processUnit: function (unitData) {
    let unitsByID = this.get('unitsByID');
    let unit = unitsByID[unitData.unit_id] || {};

    unit = _.extend(unit, unitData);
    unitsByID[unit.unit_id] = unit;
    this.set({unitsByID});

    this.emit(HEALTH_UNIT_SUCCESS, unit.unit_id);
  },

  processNodes: function (nodes, unitID) {
    let unitsByID = this.get('unitsByID');
    let unit = unitsByID[unitID] || {};

    unit.nodes = nodes;
    unitsByID[unitID] = unit;
    this.set({unitsByID});

    this.emit(HEALTH_UNIT_NODES_SUCCESS);
  },

  processNode: function (nodeData) {
    let nodesByID = this.get('nodesByID');
    let node = nodesByID[nodeData.hostname] || {};

    node = _.extend(node, nodeData);
    nodesByID[node.hostname] = node;
    this.set({nodesByID});

    this.emit(HEALTH_UNIT_NODE_SUCCESS);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    if (payload.source !== SERVER_ACTION) {
      return false;
    }

    let action = payload.action;
    let data = action.data;

    switch (action.type) {
      case REQUEST_HEALTH_UNITS_SUCCESS:
        UnitHealthStore.processUnits(data);
        break;
      case REQUEST_HEALTH_UNITS_ERROR:
        UnitHealthStore.emit(HEALTH_UNITS_ERROR, data);
        break;
      case REQUEST_HEALTH_UNIT_SUCCESS:
        UnitHealthStore.processUnit(data);
        break;
      case REQUEST_HEALTH_UNIT_ERROR:
        UnitHealthStore.emit(HEALTH_UNIT_ERROR, data);
        break;
      case REQUEST_HEALTH_UNIT_NODES_SUCCESS:
        UnitHealthStore.processNodes(data, action.unitID);
        break;
      case REQUEST_HEALTH_UNIT_NODES_ERROR:
        UnitHealthStore.emit(HEALTH_UNIT_NODES_ERROR, data);
        break;
      case REQUEST_HEALTH_UNIT_NODE_SUCCESS:
        UnitHealthStore.processNode(data);
        break;
      case REQUEST_HEALTH_UNIT_NODE_ERROR:
        UnitHealthStore.emit(HEALTH_UNIT_NODE_ERROR, data);
        break;
    }

    return true;
  })

});

module.exports = UnitHealthStore;
