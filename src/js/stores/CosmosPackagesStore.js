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

    this.emit(
      EventTypes.COSMOS_DESCRIBE_CHANGE,
      ...Array.prototype.slice.call(arguments, 1)
    );
  },

  processDescribeError: function () {
    this.emit(EventTypes.COSMOS_DESCRIBE_ERROR, ...arguments);
  },

  processListSuccess: function (packages) {
    this.set({
      search: new UniversePackagesList({
        items: packages
      })
    });

    this.emit(
      EventTypes.COSMOS_LIST_CHANGE,
      ...Array.prototype.slice.call(arguments, 1)
    );
  },

  processListError: function () {
    this.emit(EventTypes.COSMOS_LIST_ERROR, ...arguments);
  },

  processSearchSuccess: function (packages) {
    this.set({
      search: new UniversePackagesList({
        items: packages
      })
    });

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
    let args = [];
    Object.keys(action).forEach(function (key) {
      if (key !== 'type') {
        args.push(action[key]);
      }
    });

    switch (action.type) {
      case ActionTypes.REQUEST_COSMOS_PACKAGE_DESCRIBE_SUCCESS:
        CosmosPackagesStore.processDescribeSuccess(...args);
        break;
      case ActionTypes.REQUEST_COSMOS_PACKAGE_DESCRIBE_ERROR:
        CosmosPackagesStore.processDescribeError(...args);
        break;
      case ActionTypes.REQUEST_COSMOS_PACKAGES_LIST_SUCCESS:
        CosmosPackagesStore.processListSuccess(...args);
        break;
      case ActionTypes.REQUEST_COSMOS_PACKAGES_LIST_ERROR:
        CosmosPackagesStore.processListError(...args);
        break;
      case ActionTypes.REQUEST_COSMOS_PACKAGES_SEARCH_SUCCESS:
        CosmosPackagesStore.processSearchSuccess(...args);
        break;
      case ActionTypes.REQUEST_COSMOS_PACKAGES_SEARCH_ERROR:
        CosmosPackagesStore.processSearchError(...args);
        break;
    }

    return true;
  })

});

module.exports = CosmosPackagesStore;
