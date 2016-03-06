import SDK from './SDK';

module.exports = function (PluginSDK) {
  SDK.setSDK(PluginSDK);

  let PluginHooks = require('./hooks');
  let TrackingActions = require('./actions/Actions');
  let TrackingReducer = require('./Reducer');
  // Set plugin's hooks
  PluginHooks.initialize();

  // Register Actions
  PluginSDK.registerActions(TrackingActions);

  return TrackingReducer;
};
