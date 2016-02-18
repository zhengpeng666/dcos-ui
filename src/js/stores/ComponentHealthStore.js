import {Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import ComponentHealthActions from '../events/ComponentHealthActions';
import EventTypes from '../constants/EventTypes';
import GetSetMixin from '../mixins/GetSetMixin';
import HealthComponentList from '../structs/HealthComponentList';

const ComponentHealthStore = Store.createStore({

  storeID: 'componentHealth',

  mixins: [GetSetMixin],

  getSet_data: {
    components: new HealthComponentList()
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  fetchComponents: ComponentHealthActions.fetchComponents,

  fetchReport: ComponentHealthActions.fetchReport,

  processComponents: function (components) {
    this.set({
      components: new HealthComponentList({
        items: components
      })
    });

    this.emit(EventTypes.HEALTH_COMPONENTS_CHANGE);
  },

  processComponentsError: function (error) {
    this.emit(EventTypes.HEALTH_COMPONENTS_ERROR, error);
  },

  processReport: function (report) {
    this.set({report});
    this.emit(EventTypes.HEALTH_REPORT_CHANGE);
  },

  processReportError: function (error) {
    this.emit(EventTypes.HEALTH_REPORT_ERROR, error);
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
        ComponentHealthStore.processComponentsError(action.data);
        break;
      case ActionTypes.REQUEST_HEALTH_REPORT_SUCCESS:
        ComponentHealthStore.processReport(action.data);
        break;
      case ActionTypes.REQUEST_HEALTH_REPORT_ERROR:
        ComponentHealthStore.processReportError(action.data);
        break;
    }

    return true;
  })

});

module.exports = ComponentHealthStore;
