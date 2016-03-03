import IntercomStore from './stores/IntercomStore';
import {
  INTERCOM_CHANGE
} from './constants/EventTypes';

let SDK = require('./SDK').getSDK();

module.exports = {
  register() {

    let StoreMixinConfig = SDK.get('StoreMixinConfig');

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
  }
};
