import _ from 'underscore';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import createLogger from 'redux-logger';

import AppReducer from './AppReducer';
import Config from '../config/Config';
import {APP_NAMESPACE} from '../constants/EventTypes';

const middleware = [];
const reducers = {
  [APP_NAMESPACE]: AppReducer
};

// Push Dev middleware to observe actions and state
if (Config.environment === 'development'
  && Config
  .uiConfigurationFixture
  .uiConfiguration
  .enableDevTools) {

  middleware.push(createLogger());
}

// Create Redux Store
const Store = createStore(
  combineReducers(reducers),
  applyMiddleware(...middleware)
);

/**
 * Bootstraps plugins and adds new reducers to Store
 *
 * @param  {Object} pluginsConfiguration Associative Array of plugins to load
 */
const initialize = function (pluginsConfiguration) {
  Object.keys(pluginsConfiguration).forEach((pluginName) => {
    bootstrapPlugin(pluginName, pluginsConfiguration[pluginName]);
  });
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
  let pluginReducer = config.plugin(
    Store,
    createDispatcher(name),
    name,
    config.options || {}
  );
  if (pluginReducer) {
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
  dispatch: createDispatcher(APP_NAMESPACE),
  initialize: initialize
};

