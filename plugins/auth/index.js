import SDK from './SDK';

module.exports = function (PluginSDK) {
  SDK.setSDK(PluginSDK);

  let AuthReducer = require('./Reducer');
  let PluginHooks = require('./hooks');

  // Set plugin's hooks
  PluginHooks.initialize();

  return AuthReducer;
};
