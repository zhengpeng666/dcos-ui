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
import NodesList from '../structs/NodesList';

const UnitHealthStore = Store.createStore({

  storeID: 'unitHealth',

  mixins: [GetSetMixin],

  getSet_data: {
    units: new HealthUnitsList(),
    unitsByID: {}
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  getUnits: function () {
    return this.get('units');
  },

  getUnit: function (id) {
    return new HealthUnit(this.get('unitsByID')[id] || {});
  },

  getNodes: function (unitID) {
    // let parentUnit = this.get('unitsByID')[id] || {id: };
  },

  getNode: function (unitID, nodeID) {

  },

  getReport: function () {
    return this.get('report');
  },

  fetchUnits: UnitHealthActions.fetchUnits,

  fetchUnit: UnitHealthActions.fetchUnit,

  fetchNodes: UnitHealthActions.fetchNodes,

  fetchNode: UnitHealthActions.fetchNode,

  processUnits: function (units) {
    this.set({
      units: new HealthUnitsList({
        items: units
      })
    });

    this.emit(HEALTH_UNITS_CHANGE);
  },

  processUnit: function (unitData) {
    let unitsByID = this.get('unitsByID');
    let unit = unitsByID[unitData.id] || {};

    unit = _.extend(unit, unitData);
    unitsByID[unit.id] = unit;
    this.set({unitsByID});

    this.emit(HEALTH_UNIT_SUCCESS, unit.id);
  },

  processNodes: function (nodes) {
    this.emit(HEALTH_UNIT_NODES_SUCCESS);
  },

  processNode: function (nodeData) {
    this.emit(HEALTH_UNIT_NODE_SUCCESS);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    if (payload.source !== SERVER_ACTION) {
      return false;
    }

    let action = payload.action;

    switch (action.type) {
      case REQUEST_HEALTH_UNITS_SUCCESS:
        UnitHealthStore.processUnits(action.data);
        break;
      case REQUEST_HEALTH_UNITS_ERROR:
        UnitHealthStore.emit(HEALTH_UNITS_ERROR, action.data);
        break;
      case REQUEST_HEALTH_UNIT_SUCCESS:
        UnitHealthStore.processUnit(action.data);
        break;
      case REQUEST_HEALTH_UNIT_ERROR:
        UnitHealthStore.emit(HEALTH_UNIT_ERROR, action.data);
        break;
      case REQUEST_HEALTH_UNIT_NODES_SUCCESS:
        UnitHealthStore.processNodes(action.data);
        break;
      case REQUEST_HEALTH_UNIT_NODES_ERROR:
        UnitHealthStore.emit(HEALTH_UNIT_NODES_ERROR, action.data);
        break;
      case REQUEST_HEALTH_UNIT_NODE_SUCCESS:
        UnitHealthStore.processNode(action.data);
        break;
      case REQUEST_HEALTH_UNIT_NODE_ERROR:
        UnitHealthStore.emit(HEALTH_UNIT_NODE_ERROR, action.data);
        break;
    }

    return true;
  })

});

module.exports = UnitHealthStore;
