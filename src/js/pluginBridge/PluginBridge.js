import _ from 'underscore';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';

import {APPLICATION} from '../constants/PluginConstants';
import AppReducer from './AppReducer';
import Config from '../config/Config';

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
const Store = createStore(
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
 * @param  {Object} pluginsConfiguration Associative Array of plugins to load
 */
const initialize = function (pluginsConfiguration) {
  Object.keys(pluginsConfiguration).forEach((pluginName) => {
    bootstrapPlugin(pluginName, pluginsConfiguration[pluginName]);
  });
  // Replace all store reducers now that we have all plugin reducers
  Store.replaceReducer(
    combineReducers(reducers)
  );
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
 * @param  {Object} config Plugin configuration
 */
const bootstrapPlugin = function (name, config) {
  // Inject Application key constant and configOptions if specified
  let options = {
    APPLICATION: APPLICATION,
    configOptions: config.configOptions || {}
  };

  let pluginReducer = config.plugin(
    Store,
    createDispatcher(name),
    name,
    options
  );
  // If plugin exported a reducer, add it to the reducers object
  if (pluginReducer) {
    if (!_.isFunction(pluginReducer)) {
      throw new Error(`Reducer for ${name} must be a function`);
    }
    addPluginReducer(pluginReducer, name);
  }
};

/**
 * Adds a plugin's reducer to the reducers Object
 *
 * @param {Function} reducer    Reducer function to manage plugins state in Store
 * @param {String} pluginName   Plugin's name
 */
const addPluginReducer = function (reducer, pluginName) {
  if (typeof reducer !== 'function') {
    throw new Error(`Reducer for ${pluginName} must be a function`);
  }
  reducers[pluginName] = reducer;
};

module.exports = {
  Store: Store,
  dispatch: createDispatcher(APPLICATION),
  initialize: initialize
};

