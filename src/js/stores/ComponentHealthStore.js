import _ from 'underscore';
import {Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import ComponentHealthActions from '../events/ComponentHealthActions';
import EventTypes from '../constants/EventTypes';
import HealthComponent from '../structs/HealthComponent';
import HealthComponentList from '../structs/HealthComponentList';
import GetSetMixin from '../mixins/GetSetMixin';
import NodesList from '../structs/NodesList';

const ComponentHealthStore = Store.createStore({

  storeID: 'componentHealth',

  mixins: [GetSetMixin],

  getSet_data: {
    components: new HealthComponentList(),
    componentsByID: {}
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  getComponents: function () {
    return this.get('components');
  },

  getComponent: function (id) {
    return new HealthComponent(this.get('componentsByID')[id] || {});
  },

  getNodes: function (componentID) {
    // let parentComponent = this.get('componentsByID')[id] || {id: };
  },

  getNode: function (componentID, nodeID) {

  },

  getReport: function () {
    return this.get('report');
  },

  fetchComponents: ComponentHealthActions.fetchComponents,

  fetchComponent: ComponentHealthActions.fetchComponent,

  fetchNodes: ComponentHealthActions.fetchNodes,

  fetchNode: ComponentHealthActions.fetchNode,

  fetchReport: ComponentHealthActions.fetchReport,

  processComponents: function (components) {
    this.set({
      components: new HealthComponentList({
        items: components
      })
    });

    this.emit(EventTypes.HEALTH_COMPONENTS_CHANGE);
  },

  processComponent: function (componentData) {
    let componentsByID = this.get('componentsByID');
    let component = componentsByID[componentData.id] || {};

    component = _.extend(component, componentData);
    componentsByID[component.id] = component;
    this.set({componentsByID});

    this.emit(EventTypes.HEALTH_COMPONENT_SUCCESS, component.id);
  },

  processNodes: function (nodes) {
    // this.emit(EventTypes.HEALTH_COMPONENT_NODES_SUCCESS);
  },

  processNode: function (nodeData) {
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    if (payload.source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    let action = payload.action;

    switch (action.type) {
      case ActionTypes.REQUEST_HEALTH_COMPONENTS_SUCCESS:
        ComponentHealthStore.processComponents(action.data);
        break;
      case ActionTypes.REQUEST_HEALTH_COMPONENTS_ERROR:
        this.emit(EventTypes.HEALTH_COMPONENTS_ERROR, action.data);
        break;
      case ActionTypes.REQUEST_HEALTH_COMPONENT_SUCCESS:
        ComponentHealthStore.processComponent(action.data);
        break;
      case ActionTypes.REQUEST_HEALTH_COMPONENT_ERROR:
        this.emit(EventTypes.HEALTH_COMPONENT_ERROR, action.data);
        break;
      case ActionTypes.REQUEST_HEALTH_COMPONENT_NODES_SUCCESS:
        ComponentHealthStore.processNodes(action.data);
        break;
      case ActionTypes.REQUEST_HEALTH_COMPONENT_NODES_ERROR:
        this.emit(EventTypes.HEALTH_COMPONENT_NODES_ERROR, action.data);
        break;
      case ActionTypes.REQUEST_HEALTH_COMPONENT_NODE_SUCCESS:
        ComponentHealthStore.processNode(action.data);
        break;
      case ActionTypes.REQUEST_HEALTH_COMPONENT_NODE_ERROR:
        this.emit(EventTypes.HEALTH_COMPONENT_NODE_ERROR, action.data);
        break;
    }

    return true;
  })

});

module.exports = ComponentHealthStore;
