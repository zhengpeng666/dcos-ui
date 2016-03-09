import SDK from './SDK';

module.exports = function (PluginSDK) {

  SDK.setSDK(PluginSDK);

  let DirectoriesHooks = require('./submodules/directories/hooks');
  let GroupsHooks = require('./submodules/groups/hooks');
  let PluginHooks = require('./hooks');
  let OrganizationReducer = require('./Reducer');
  let UsersHooks = require('./submodules/users/hooks');

  // Set plugin's hooks
  PluginHooks.initialize();
  // Set submodule hooks
  GroupsHooks.initialize();
  UsersHooks.initialize();
  DirectoriesHooks.initialize();

  return OrganizationReducer;
};

