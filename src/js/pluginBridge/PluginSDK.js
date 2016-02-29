import _ from 'underscore';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';

import {APPLICATION} from '../constants/PluginConstants';
import {APP_STORE_CHANGE} from '../constants/EventTypes';
import AppReducer from './AppReducer';
import Config from '../config/Config';
import Hooks from './Hooks';
import PluginSDKStruct from './PluginSDKStruct';
import Loader from './Loader';
import PluginModules from './PluginModules';

const initialState = {};
const middleware = [];
const PLUGIN_ENV_CACHE = [];
const REGISTERED_ACTIONS = {};

const constants = {
  APPLICATION,
  APP_STORE_CHANGE
};

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

  let pluginList = Loader.getAvailablePlugins();
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
 * @param  {String} pluginID Plugin pluginID
 * @return {Function}    Dispatch method
 */
const createDispatcher = function (pluginID) {
  return function (action) {
    // Inject origin namespace if simple Object
    if (action === Object(action)) {
      action = _.extend({}, action, {__origin: pluginID});
    }
    Store.dispatch(action);
  };
};

const getModule = function (moduleName) {

  let foundDirs = Object.keys(PluginModules).filter(directory => {
    return moduleName in PluginModules[directory];
  });
  if (!foundDirs.length) {
    throw new Error(`Module ${moduleName} does not exist.`);
  }
  let dir = foundDirs[0];
  return Loader.requireModule(dir, PluginModules[dir][moduleName]);
};

const getApplicationModuleAPI = function () {
  // Return get
  return {
    get(modules) {
      if (Array.isArray(modules)) {
        // Return Object of Modules so we can use Object destructuring at the
        // other end.
        return modules.reduce((acc, module) => {
          acc[module] = getModule(module);
          return acc;
        }, {});
      }
      return getModule(modules);
    }
  };
};

const getActionsAPI = function (SDK) {
  // Return an API
  return {
    registerActions(name, actionsModule) {
      if (!name) {
        throw new Error(`Name not valid.`);
      }
      if (name in REGISTERED_ACTIONS) {
        console.warn(`${name} already exists in Actions registry. ${name} failed to register.`);
        return;
      }
      if (!actionsModule || typeof actionsModule !== 'function') {
        throw new Error(`Failed to supply Actions for ${name}`);
      }
      REGISTERED_ACTIONS[name] = actionsModule;
    },

    getActions(name, defaultValue) {
      if (!name || typeof name !== 'string') {
        throw new Error(`Name not valid. Passed in ${name}`);
      }
      // Return Actions instantiated with SDK.
      // Actions will now use Plugin's own dispatch
      if (!REGISTERED_ACTIONS[name]) {
        if (defaultValue !== undefined) {
          return defaultValue;
        }
        throw Error(`No registered actions for ${name}. Make sure plugin is loaded or actions are registered`);
      }
      return REGISTERED_ACTIONS[name](SDK);
    }
  };
};

// Register actions exposed in DCOSActions
const registerApplicationActions = function (SDK) {
  if (PluginModules.events) {
    Object.keys(PluginModules.events).forEach(name => {
      SDK.registerActions(name, getModule(name));
    });
  }
};

const extendSDK = function (SDK, obj) {
  Object.keys(obj).forEach(methodName => {
    SDK[methodName] = obj[methodName].bind(SDK);
  });
};

const getSDK = function (pluginID, config) {

  if (pluginID in PLUGIN_ENV_CACHE) {
    return PLUGIN_ENV_CACHE[pluginID];
  }

  let StoreAPI = Store;

  if (pluginID !== APPLICATION) {
    // Limit access for Plugins
    StoreAPI = {
      subscribe: Store.subscribe.bind(Store),
      getState: Store.getState.bind(Store)
    };
  }

  let SDK = new PluginSDKStruct({
    config: config || {},
    dispatch: createDispatcher(pluginID),
    Store: StoreAPI,
    Hooks,
    pluginID,
    constants
  });

  extendSDK(SDK, getActionsAPI(SDK));

  extendSDK(SDK, getApplicationModuleAPI());

  PLUGIN_ENV_CACHE[pluginID] = SDK;

  return SDK;
};

/**
 * Bootstraps a plugin
 *
 * @param  {String} pluginID   Plugin's pluginID from config
 * @param  {Module} plugin Plugin module or path to entry point within plugins directory
 * @param  {Object} config Plugin configuration
 */
const bootstrapPlugin = function (pluginID, plugin, config) {
  // Inject Application key constant and configOptions if specified
  let SDK = getSDK(pluginID, config);

  if (typeof plugin === 'string') {
    plugin = Loader.requireModule('plugins', plugin);
  }

  let pluginReducer = plugin(SDK);

  // If plugin exported a reducer, add it to the reducers object
  if (pluginReducer) {
    addPluginReducer(pluginReducer, pluginID);
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
// Lets get an SDK for the Application
let ApplicationSDK = getSDK(APPLICATION, Config);
// Register our Actions
registerApplicationActions(ApplicationSDK);

// Add helper for PluginTestUtils. This allows us to get SDKS for other plugins
ApplicationSDK.__getSDK = getSDK;
// Add manual load method
ApplicationSDK.initialize = initialize;
// Work around for circular dependency. Hopefully we can deprecate this at some point.
ApplicationSDK.listenForConfigChange = listenForConfigChange;

module.exports = ApplicationSDK;
