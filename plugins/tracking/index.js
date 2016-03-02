import _PluginHooks from './hooks';
import TrackingActions from './actions/Actions';
import _storeConfig from './storeConfig';

module.exports = function (PluginSDK) {
  // Set plugin's hooks
  _PluginHooks(PluginSDK).initialize();

  _storeConfig(PluginSDK);

  // Register Actions
  PluginSDK.registerActions(TrackingActions);
};
