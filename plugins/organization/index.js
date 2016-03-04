import SDK from './SDK';

module.exports = function (PluginSDK) {

  SDK.setSDK(PluginSDK);

  let DirectoriesHooks = require('./submodules/directories/hooks');
  let GroupsHooks = require('./submodules/groups/hooks');
  let PluginHooks = require('./hooks');
  let UsersHooks = require('./submodules/users/hooks');
  let StoreConfig = require('./storeConfig');

  // Set plugin's hooks
  PluginHooks.initialize();
  // Set submodule hooks
  GroupsHooks.initialize();
  UsersHooks.initialize();
  DirectoriesHooks.initialize();

   // Register our Stores
  StoreConfig.register();
};

