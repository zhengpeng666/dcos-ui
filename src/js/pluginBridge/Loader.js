// Provide webpack contexts for smarter build. Without these,
// webpack will try to be smart an auto create the contexts,
// doubling the built output
const requirePlugin = require.context('../../../plugins', false);
const requireConfig = require.context('../config', false);
const requireEvents = require.context('../events', false);
const requireStructs = require.context('../structs', false);
const requireUtils = require.context('../utils', false);
const requireMixins = require.context('../mixins', false);
const requireComponents = require.context('../components', false);

let pluginsList;

try {
  pluginsList = require('../../../plugins/index');
} catch(err) {
  // No plugins
  pluginsList = {};
}

function getAvailablePlugins() {
  return pluginsList;
}

function requireModule(dir, name) {
  let path = './' + name;
  switch (dir) {
    case 'config':
      return requireConfig(path);
    case 'events':
      return requireEvents(path);
    case 'structs':
      return requireStructs(path);
    case 'utils':
      return requireUtils(path);
    case 'mixins':
      return requireMixins(path);
    case 'components':
      return requireComponents(path);
    case 'plugin':
      return requirePlugin(path);
  }
}

module.exports = {
  getAvailablePlugins,
  requireModule
};
