import _PluginHooks from './hooks';
import _StoreConfig from './storeConfig';

module.exports = function (PluginSDK) {
  // Set plugin's hooks
  _PluginHooks(PluginSDK).initialize();
  // Register our Stores
  _StoreConfig(PluginSDK);
};
