import SDK from './SDK';

module.exports = function (PluginSDK) {
  SDK.setSDK(PluginSDK);

  let PluginHooks = require('./hooks');
  let TrackingActions = require('./actions/Actions');
  let storeConfig = require('./storeConfig');
  // Set plugin's hooks
  PluginHooks.initialize();

  storeConfig.register();

  // Register Actions
  PluginSDK.registerActions(TrackingActions);
};
