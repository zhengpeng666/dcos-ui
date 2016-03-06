import {INTERCOM_CHANGE} from '../constants/EventTypes';

let SDK = require('../SDK').getSDK();

var IntercomStore = SDK.createStore({
  storeID: 'intercom',

  exposeEvents: {
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

  get(prop) {
    return SDK.Store.getOwnState()[prop];
  },

  handleChange: function (isOpen) {
    // only handle change if there is one
    if (this.get('isOpen') !== isOpen) {
      SDK.dispatch({
        type: INTERCOM_CHANGE,
        isOpen
      });
      this.emit(INTERCOM_CHANGE);
    }
  }
});

module.exports = IntercomStore;
