import _PluginHooks from './hooks';

module.exports = function (PluginSDK) {

  // Set plugin's hooks
  _PluginHooks(PluginSDK).initialize();
};

