import pluginHooks from './pluginHooks';

module.exports = function (Store, dispatch, name, options) {
  const {Hooks, config} = options;

  // Set plugin's hooks
  pluginHooks.initialize(Hooks);
  pluginHooks.configure(config);
};

