import JestUtil from '../utils/JestUtil';
import Loader from './Loader';
import PluginModules from './PluginModules';
import PluginSDK from 'PluginSDK';

/**
 * Loads whatever plugins are passed in. Could be Mocks
 * @param  {Object} plugins - Plugin name to Config
 */
function loadPlugins(plugins) {
  var availablePlugins = {};
  var pluginConfig = {};

  Object.keys(plugins).forEach(function (pluginID) {
    availablePlugins[pluginID] = plugins[pluginID].module;
    pluginConfig[pluginID] = plugins[pluginID].config;
  });

  Loader.__setMockPlugins(availablePlugins);
  PluginSDK.initialize(pluginConfig);
}

/**
 * Finds actual plugins by name and loads them
 * @param  {Object} plugins - Map of name to config
 */
function loadPluginsByName(plugins) {
  let pluginsToLoad = {};

  let availablePlugins = Loader.__getAvailablePlugins();
  Object.keys(plugins).forEach(function (pluginID) {

    if (!(pluginID in availablePlugins)) {
      throw new Error(`${pluginID} does not exist. Failed to load.`);
    }
    // Automatically unMock the plugin seeing we obviously need it's functionality
    unMockPlugin(pluginID);

    pluginsToLoad[pluginID] = {
      module: availablePlugins[pluginID],
      config: plugins[pluginID]
    };
  });
  loadPlugins(pluginsToLoad);

}

function getSDK(pluginID, config) {
  // Get SDK for pluginID. If Plugin hasn't been initialized,
  // this will create the SDK, cache it, and pass into the plugin if
  // it is eventually initialized.
  return PluginSDK.__getSDK(pluginID, config);
}

function setMock(name, mock) {
  Loader.__setMockModule(name, mock);
  return mock;
}

function unMockPlugin(pluginID) {
  let availablePlugins = Loader.__getAvailablePlugins();
  if (pluginID in availablePlugins) {
    jest.dontMock('../../../plugins/' + availablePlugins[pluginID]);
    return true;
  }
}

/**
 * Takes an Array or String representing a module name{s) that need unMocking,
 * finds the directory of the file and calls jest.dontMock on path.
 * @param  {Array|String} moduleNames - Names of modules to dontMock

 */
function dontMock(moduleNames) {
  if (Array.isArray(moduleNames)) {
    moduleNames.forEach(dontMock);
    return;
  }
  // Just one module to mock
  var name = moduleNames;
  // Try unmocking store first
  if (JestUtil.dontMockStore(name)) {
    return;
  }
  // Try unmocking plugin
  if (unMockPlugin(name)) {
    return;
  }
  // Assuming modules have unique names
  let foundType = Object.keys(PluginModules).filter(moduleType => {
    return name in PluginModules[moduleType];
  });
  if (!foundType.length) {
    throw new Error(`Module ${name} does not exist.`);
  }
  let modulePath = `../${foundType[0]}/${PluginModules[foundType[0]][name]}`;
  jest.dontMock(modulePath);
}

let TestUtils = {
  loadPlugins,
  loadPluginsByName,
  getSDK,
  dontMock,
  setMock,
  unMockStores: JestUtil.unMockStores
};

module.exports = TestUtils;
