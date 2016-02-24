import PluginHooks from './pluginHooks';

module.exports = function (Store, dispatch, name, options) {
  const {Hooks, config} = options;

  // Set plugin's hooks
  PluginHooks.initialize(Hooks);
  PluginHooks.configure(config);
};

