import {GetSetMixin, Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import CosmosPackagesActions from '../events/CosmosPackagesActions';
import EventTypes from '../constants/EventTypes';
import UniverseInstalledPackagesList from
  '../structs/UniverseInstalledPackagesList';
import UniversePackage from '../structs/UniversePackage';
import UniversePackagesList from '../structs/UniversePackagesList';

const CosmosPackagesStore = Store.createStore({
  storeID: 'cosmosPackages',

  mixins: [GetSetMixin],

  getSet_data: {
    availablePackages: new UniversePackagesList(),
    packageDetails: new UniversePackage(),
    installedPackages: new UniversePackagesList()
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  /* API */
  fetchAvailablePackages: CosmosPackagesActions.fetchAvailablePackages,

  fetchInstalledPackages: CosmosPackagesActions.fetchInstalledPackages,

  fetchPackageDescription: CosmosPackagesActions.fetchPackageDescription,

  /* Reducers */
  processAvailablePackagesSuccess: function (packages, query) {
    this.set({availablePackages: new UniversePackagesList({items: packages})});

    this.emit(EventTypes.COSMOS_SEARCH_CHANGE, query);
  },

  processAvailablePackagesError: function (error, query) {
    this.emit(EventTypes.COSMOS_SEARCH_ERROR, error, query);
  },

  processInstalledPackagesSuccess: function (packages, name, appId) {
    this.set({
      installedPackages: new UniverseInstalledPackagesList({items: packages})
    });

    this.emit(EventTypes.COSMOS_LIST_CHANGE, packages, name, appId);
  },

  processInstalledPackagesError: function (error, name, appId) {
    this.emit(EventTypes.COSMOS_LIST_ERROR, error, name, appId);
  },

  processPackageDescriptionSuccess: function (cosmosPackage, name, version) {
    this.set({packageDetails: new UniversePackage(cosmosPackage)});

    this.emit(EventTypes.COSMOS_DESCRIBE_CHANGE, cosmosPackage, name, version);
  },

  processPackageDescriptionError:
    function (cosmosPackage, name, version) {
    this.emit(EventTypes.COSMOS_DESCRIBE_ERROR, cosmosPackage, name, version);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let source = payload.source;
    if (source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    let action = payload.action;
    let data = action.data;

    switch (action.type) {
      case ActionTypes.REQUEST_COSMOS_PACKAGE_DESCRIBE_SUCCESS:
        CosmosPackagesStore.processPackageDescriptionSuccess(
          data,
          action.packageName,
          action.packageVersion
        );
        break;
      case ActionTypes.REQUEST_COSMOS_PACKAGE_DESCRIBE_ERROR:
        CosmosPackagesStore.processPackageDescriptionError(
          data,
          action.packageName,
          action.packageVersion
        );
        break;
      case ActionTypes.REQUEST_COSMOS_PACKAGES_LIST_SUCCESS:
        CosmosPackagesStore.processInstalledPackagesSuccess(
          data,
          action.packageName,
          action.appId
        );
        break;
      case ActionTypes.REQUEST_COSMOS_PACKAGES_LIST_ERROR:
        CosmosPackagesStore.processInstalledPackagesError(
          data,
          action.packageName,
          action.appId
        );
        break;
      case ActionTypes.REQUEST_COSMOS_PACKAGES_SEARCH_SUCCESS:
        CosmosPackagesStore.processAvailablePackagesSuccess(data, action.query);
        break;
      case ActionTypes.REQUEST_COSMOS_PACKAGES_SEARCH_ERROR:
        CosmosPackagesStore.processAvailablePackagesError(data, action.query);
        break;
    }

    return true;
  })

});

module.exports = CosmosPackagesStore;
