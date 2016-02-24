import PluginHooks from './hooks';

module.exports = function (Store, dispatch, name, options) {
  const {Hooks} = options;

  // Set plugin's hooks
  PluginHooks.initialize(Hooks);
};

