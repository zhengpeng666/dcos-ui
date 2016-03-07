import {INTERCOM_CHANGE} from '../constants/EventTypes';

let SDK = require('../SDK').getSDK();

var IntercomStore = SDK.createStore({
  storeID: 'intercom',

  mixinEvents: {
    events: {
      change: INTERCOM_CHANGE
    },
    unmountWhen: function () {
      return true;
    },
    listenAlways: true
  },

  init: function () {

    var intercom = global.Intercom;
    if (intercom != null) {
      // make sure to hide Intercom on load
      intercom('hide');

      // register for intercom events
      intercom('onHide', this.handleChange.bind(this, false));
      intercom('onShow', this.handleChange.bind(this, true));
    }
  },

  isOpen() {
    return SDK.Store.getOwnState().isOpen;
  },

  handleChange: function (isOpen) {
    // only handle change if there is one
    if (this.isOpen() !== isOpen) {
      SDK.dispatch({
        type: INTERCOM_CHANGE,
        isOpen
      });
      this.emit(INTERCOM_CHANGE);
    }
  }
});

module.exports = IntercomStore;
