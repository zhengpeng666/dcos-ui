import _PluginHooks from './hooks';
import IntercomActions from './actions/IntercomActions';
import TrackingActions from './actions/Actions';

module.exports = function (PluginSDK) {
  // Set plugin's hooks
  _PluginHooks(PluginSDK).initialize();

  // Register Actions
  PluginSDK.registerActions('Intercom', IntercomActions);
  PluginSDK.registerActions('Tracking', TrackingActions);
};

