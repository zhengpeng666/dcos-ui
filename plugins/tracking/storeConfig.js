import _IntercomStore from './stores/IntercomStore';
import {
  INTERCOM_CHANGE
} from './constants/EventTypes';

module.exports = (PluginSDK) => {

  let IntercomStore = _IntercomStore(PluginSDK);

  let StoreMixinConfig = PluginSDK.get('StoreMixinConfig');

  StoreMixinConfig.add('intercom', {
    store: IntercomStore,
    events: {
      change: INTERCOM_CHANGE
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  });
};
