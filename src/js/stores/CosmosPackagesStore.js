import {GetSetMixin, Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import CosmosPackagesActions from '../events/CosmosPackagesActions';
import EventTypes from '../constants/EventTypes';
import UniversePackage from '../structs/UniversePackage';
import UniversePackagesList from '../structs/UniversePackagesList';

const CosmosPackagesStore = Store.createStore({
  storeID: 'cosmosPackages',

  mixins: [GetSetMixin],

  getSet_data: {
    description: new UniversePackage(),
    list: new UniversePackagesList(),
    search: new UniversePackagesList()
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  /* API */
  fetchDescription: CosmosPackagesActions.fetchDescription,

  fetchList: CosmosPackagesActions.fetchList,

  search: CosmosPackagesActions.search,

  /* Reducers */
  processDescribeSuccess: function (pkg) {
    this.set({description: new UniversePackage(pkg)});

    this.emit(
      EventTypes.COSMOS_DESCRIBE_CHANGE,
      ...Array.prototype.slice.call(arguments, 1)
    );
  },

  processDescribeError: function () {
    this.emit(EventTypes.COSMOS_DESCRIBE_ERROR, ...arguments);
  },

  processListSuccess: function (packages) {
    this.set({list: new UniversePackagesList({items: packages})});

    this.emit(
      EventTypes.COSMOS_LIST_CHANGE,
      ...Array.prototype.slice.call(arguments, 1)
    );
  },

  processListError: function () {
    this.emit(EventTypes.COSMOS_LIST_ERROR, ...arguments);
  },

  processSearchSuccess: function (packages) {
    this.set({search: new UniversePackagesList({items: packages})});

    this.emit(
      EventTypes.COSMOS_SEARCH_CHANGE,
      ...Array.prototype.slice.call(arguments, 1)
    );
  },

  processSearchError: function () {
    this.emit(EventTypes.COSMOS_SEARCH_ERROR, ...arguments);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let source = payload.source;
    if (source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    let action = payload.action;

    // Creating an array of arguments (without 'type')
    let payloadValues = Object.keys(action).slice(1).map(function (key) {
      return action[key];
    });

    switch (action.type) {
      case ActionTypes.REQUEST_COSMOS_PACKAGE_DESCRIBE_SUCCESS:
        CosmosPackagesStore.processDescribeSuccess(...payloadValues);
        break;
      case ActionTypes.REQUEST_COSMOS_PACKAGE_DESCRIBE_ERROR:
        CosmosPackagesStore.processDescribeError(...payloadValues);
        break;
      case ActionTypes.REQUEST_COSMOS_PACKAGES_LIST_SUCCESS:
        CosmosPackagesStore.processListSuccess(...payloadValues);
        break;
      case ActionTypes.REQUEST_COSMOS_PACKAGES_LIST_ERROR:
        CosmosPackagesStore.processListError(...payloadValues);
        break;
      case ActionTypes.REQUEST_COSMOS_PACKAGES_SEARCH_SUCCESS:
        CosmosPackagesStore.processSearchSuccess(...payloadValues);
        break;
      case ActionTypes.REQUEST_COSMOS_PACKAGES_SEARCH_ERROR:
        CosmosPackagesStore.processSearchError(...payloadValues);
        break;
    }

    return true;
  })

});

module.exports = CosmosPackagesStore;
