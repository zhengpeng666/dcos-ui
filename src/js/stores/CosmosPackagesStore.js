import {Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import CosmosPackagesActions from '../events/CosmosPackagesActions';
import EventTypes from '../constants/EventTypes';
import GetSetMixin from '../mixins/GetSetMixin';
import UniversePackagesList from '../structs/UniversePackagesList';

const CosmosPackagesStore = Store.createStore({
  storeID: 'CosmosPackages',

  mixins: [GetSetMixin],

  getSet_data: {
    packages: new UniversePackagesList()
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  search: CosmosPackagesActions.search,

  processPackages: function (packages) {
    this.set({
      packages: new UniversePackagesList({
        items: packages
      })
    });
    this.emit(EventTypes.COSMOS_PACKAGES_CHANGE);
  },

  processPackagesError: function (error) {
    this.emit(EventTypes.COSMOS_PACKAGES_ERROR, error);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let source = payload.source;
    if (source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    let action = payload.action;

    switch (action.type) {
      case ActionTypes.REQUEST_COSMOS_PACKAGES_SEARCH_SUCCESS:
        CosmosPackagesStore.processPackages(action.data);
        break;
      case ActionTypes.REQUEST_COSMOS_PACKAGES_SEARCH_ERROR:
        CosmosPackagesStore.processPackagesError(action.data);
        break;
    }

    return true;
  })

});

module.exports = CosmosPackagesStore;
