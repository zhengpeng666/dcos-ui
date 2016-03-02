import PluginHooks from './hooks';
import ACLHooks from './submodules/acl/hooks';

module.exports = function (Store, dispatch, name, options) {
  const {Hooks, config} = options;

  // Set plugin's hooks
  PluginHooks.initialize(Hooks);
  PluginHooks.configure(config);

  // Set hooks on submodules
  ACLHooks.initialize(Hooks);
};

