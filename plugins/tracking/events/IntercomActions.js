import {
  REQUEST_INTERCOM_OPEN,
  REQUEST_INTERCOM_CLOSE
} from '../constants/ActionTypes';

var AppDispatcher = require('../../../src/js/events/AppDispatcher');

var IntercomActions = {

  open: function () {
    AppDispatcher.handleIntercomAction({
      type: REQUEST_INTERCOM_OPEN,
      data: true
    });
  },

  close: function () {
    AppDispatcher.handleIntercomAction({
      type: REQUEST_INTERCOM_CLOSE,
      data: false
    });
  }

};

module.exports = IntercomActions;
