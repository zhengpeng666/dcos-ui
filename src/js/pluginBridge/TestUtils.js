jest.dontMock('./PluginBridge');
jest.dontMock('./Hooks');

var PluginBridge = require('./PluginBridge');
var Plugins = require('../../../plugins/index');
var ConfigStore = require('../stores/ConfigStore');

function loadPlugins(plugins) {
  var availablePlugins = {};
  var pluginConfig = {};

  Object.keys(plugins).forEach(function (pluginID) {
    availablePlugins[pluginID] = plugins[pluginID].module;
    pluginConfig[pluginID] = plugins[pluginID].config;
  });

  Plugins.__setMockPlugins(availablePlugins);
  PluginBridge.listenForConfigChange();
  ConfigStore.set({config: {
    uiConfiguration: {
      plugins: pluginConfig
    }
  }});
}

let TestUtils = {
  Hooks: PluginBridge.Hooks,
  Store: PluginBridge.Store,
  loadPlugins: loadPlugins
};

module.exports = TestUtils;
