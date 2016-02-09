import {Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import CosmosPackagesActions from '../events/CosmosPackagesActions';
import EventTypes from '../constants/EventTypes';
import GetSetMixin from '../mixins/GetSetMixin';
import UniversePackage from '../structs/UniversePackage';
import UniversePackagesList from '../structs/UniversePackagesList';

const CosmosPackagesStore = Store.createStore({
  storeID: 'CosmosPackages',

  mixins: [GetSetMixin],

  getSet_data: {
    describe: new UniversePackage(),
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
  describe: CosmosPackagesActions.describe,

  list: CosmosPackagesActions.list,

  search: CosmosPackagesActions.search,

  /* Reducers */
  processDescribeSuccess: function (pkg) {
    this.set({
      describe: new UniversePackage(pkg)
    });

    this.emit(EventTypes.COSMOS_DESCRIBE_CHANGE);
  },

  processDescribeError: function (error) {
    this.emit(EventTypes.COSMOS_DESCRIBE_ERROR, error);
  },

  processListSuccess: function (packages) {
    this.set({
      search: new UniversePackagesList({
        items: packages
      })
    });

    this.emit(EventTypes.COSMOS_LIST_CHANGE);
  },

  processListError: function (error) {
    this.emit(EventTypes.COSMOS_LIST_ERROR, error);
  },

  processSearchSuccess: function (packages) {
    this.set({
      search: new UniversePackagesList({
        items: packages
      })
    });

    this.emit(EventTypes.COSMOS_SEARCH_CHANGE);
  },

  processSearchError: function (error) {
    this.emit(EventTypes.COSMOS_SEARCH_ERROR, error);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let source = payload.source;
    if (source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    let action = payload.action;

    switch (action.type) {
      case ActionTypes.REQUEST_COSMOS_PACKAGE_DESCRIBE_SUCCESS:
        CosmosPackagesStore.processDescribeSuccess(action.data);
        break;
      case ActionTypes.REQUEST_COSMOS_PACKAGE_DESCRIBE_ERROR:
        CosmosPackagesStore.processDescribeError(action.data);
        break;
      case ActionTypes.REQUEST_COSMOS_PACKAGES_LIST_SUCCESS:
        CosmosPackagesStore.processListSuccess(action.data);
        break;
      case ActionTypes.REQUEST_COSMOS_PACKAGES_LIST_ERROR:
        CosmosPackagesStore.processListError(action.data);
        break;
      case ActionTypes.REQUEST_COSMOS_PACKAGES_SEARCH_SUCCESS:
        CosmosPackagesStore.processSearchSuccess(action.data);
        break;
      case ActionTypes.REQUEST_COSMOS_PACKAGES_SEARCH_ERROR:
        CosmosPackagesStore.processSearchError(action.data);
        break;
    }

    return true;
  })

});

module.exports = CosmosPackagesStore;
