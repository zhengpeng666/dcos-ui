import _DirectoriesHooks from './submodules/directories/hooks';
import _GroupsHooks from './submodules/groups/hooks';
import _PluginHooks from './hooks';
import _UsersHooks from './submodules/users/hooks';
import _StoreConfig from './storeConfig';

module.exports = function (PluginSDK) {
  // Set plugin's hooks
  _PluginHooks(PluginSDK).initialize();
  // Set submodule hooks
  _GroupsHooks(PluginSDK).initialize();
  _UsersHooks(PluginSDK).initialize();
  _DirectoriesHooks(PluginSDK).initialize();

   // Register our Stores
  _StoreConfig(PluginSDK);
};

