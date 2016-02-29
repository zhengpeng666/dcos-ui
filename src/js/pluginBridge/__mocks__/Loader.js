let _plugins = {};

const Plugins = {};
const Mocks = {};

let pluginsList;

try {
  pluginsList = require('../../../../plugins/index');
} catch(err) {
  pluginsList = {};
}

function __getAvailablePlugins() {
  return _plugins;
}

function __setMockPlugins(plugins) {
  _plugins = plugins;
}

function __setMockModule(name, mock) {
  Mocks[name] = mock;
}

function __requireModule(dir, name) {
  // Return mock for module
  if (name in Mocks) {
    return Mocks[name];
  }
  if (dir === 'plugins') {
    return require('../../../../plugins/' + name);
  }
  return require(`../../${dir}/${name}`);
}

// Add custom methods for testing
Plugins.__setMockPlugins = __setMockPlugins;

// Rewire so PluginSDK loads the mocked version. But still provide access
// to original method for PluginTestUtils to load actual plugins
Plugins.__getAvailablePlugins = () => pluginsList;
Plugins.getAvailablePlugins = __getAvailablePlugins;
Plugins.requireModule = __requireModule;
Plugins.__setMockModule = __setMockModule;
module.exports = Plugins;
