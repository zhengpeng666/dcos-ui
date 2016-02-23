import _ from 'underscore';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';

import {APPLICATION} from '../constants/PluginConstants';
import AppReducer from './AppReducer';
import Config from '../config/Config';
import Plugins from '../../../plugins';
import Hooks from './Hooks';

const initialState = {};
const middleware = [];

const reducers = {
  [APPLICATION]: AppReducer
};

// Default pass through function when devTools are not enabled
let devToolIfEnabled = f => f;

// Inject middleware to observe actions and state
if (Config.environment === 'development'
  && Config
  .uiConfigurationFixture
  .uiConfiguration
  .enableDevTools
  && window.devToolsExtension) {

  // Use Chrome extension if available
  // https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd
  devToolIfEnabled = window.devToolsExtension();
}

// Create Redux Store
let Store = createStore(
  combineReducers(reducers),
  initialState,
  compose(
    applyMiddleware(...middleware),
    devToolIfEnabled
  )
);

/**
 * Bootstraps plugins and adds new reducers to Store.
 *
 * @param {Object} pluginsConfig Plugin configuration from Store
 */
const initialize = function (pluginsConfig) {
  let pluginList = Plugins.getAvailablePlugins();
  Object.keys(pluginsConfig).forEach(function (pluginID) {
    // Make sure plugin is bundled
    if (!(pluginID in pluginList)) {
      console.warn(`Plugin ${pluginID} not available in bundle`);
      return;
    }
    // Bootstrap if plugin enabled
    if (pluginsConfig[pluginID].enabled) {
      bootstrapPlugin(pluginID, pluginList[pluginID], pluginsConfig[pluginID]);
    }
  });
  // Replace all store reducers now that we have all plugin reducers
  Store.replaceReducer(
    combineReducers(reducers)
  );
  Hooks.notifyPluginsLoaded();
};

/**
 * Creates a personalized dispatch for each plugin
 * @param  {String} name Plugin name
 * @return {Function}    Dispatch method
 */
const createDispatcher = function (name) {
  return function (action) {
    // Inject origin namespace if simple Object
    if (action === Object(action)) {
      action = _.extend({}, action, {__origin: name});
    }
    Store.dispatch(action);
  };
};

/**
 * Bootstraps a plugin
 *
 * @param  {String} name   Plugin's name from config
 * @param  {Module} plugin Plugin module
 * @param  {Object} config Plugin configuration
 */
const bootstrapPlugin = function (name, plugin, config) {
  // Inject Application key constant and configOptions if specified
  let options = {
    APPLICATION: APPLICATION,
    config: config || {},
    appConfig: Config,
    Hooks: Hooks
  };

  let pluginReducer = plugin(
    Store,
    createDispatcher(name),
    name,
    options
  );
  // If plugin exported a reducer, add it to the reducers object
  if (pluginReducer) {
    addPluginReducer(pluginReducer, name);
  }
};

/**
 * Adds a plugin's reducer to the reducers Object
 *
 * @param {Function} reducer    Reducer function to manage plugins state in Store
 * @param {String} pluginID     Plugin's ID
 */
const addPluginReducer = function (reducer, pluginID) {
  if (typeof reducer !== 'function') {
    throw new Error(`Reducer for ${pluginID} must be a function`);
  }
  reducers[pluginID] = reducer;
};

// Subscribe to Store config change and call initialize with
// new plugin configuration
const listenForConfigChange = function () {
  let unSubscribe = Store.subscribe(function () {
    let configStore = Store.getState()[APPLICATION].config;
    if (configStore && configStore.config && configStore.config.uiConfiguration) {
      // unsubscribe once we have the config
      unSubscribe();
      initialize(configStore.config.uiConfiguration.plugins);
    }
  });
};

module.exports = {
  Store: Store,
  dispatch: createDispatcher(APPLICATION),
  listenForConfigChange: listenForConfigChange,
  Hooks: Hooks
};

