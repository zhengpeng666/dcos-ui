import SDK from './SDK';

module.exports = function (PluginSDK) {
  SDK.setSDK(PluginSDK);

  let PluginHooks = require('./hooks');
  let NetworkingReducer = require('./Reducer');

  // Set plugin's hooks
  PluginHooks.initialize();

  return NetworkingReducer;
};
