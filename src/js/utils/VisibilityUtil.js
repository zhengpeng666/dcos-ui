import _ from 'underscore';
import Events from 'events';

import Config from '../config/Config';

const UI_INACTIVE = 'UI_INACTIVE';
let isTabVisible = true;
let isInactive = false;
let timeOut;

// Use visibility API to check if current tab is active or not
let visibility = (function () {
  let stateKey;
  let keys = {
    hidden: 'visibilitychange',
    webkitHidden: 'webkitvisibilitychange',
    mozHidden: 'mozvisibilitychange',
    msHidden: 'msvisibilitychange'
  };

  // Find first key available on document
  Object.keys(keys).some(function (key) {
    if (key in global.document) {
      stateKey = key;

      return true;
    }

    return false;
  });

  return {
    addEventListener(callback) {
      global.document.addEventListener(keys[stateKey], callback);
    },

    getVisibility() {
      return !global.document[stateKey];
    }
  };
})();

function updateActiveState() {
  isTabVisible = visibility.getVisibility();

  if (!isInactive && !timeOut && !isTabVisible) {
    timeOut = setTimeout(function () {
      isInactive = true;
      VisibilityUtil.emit(UI_INACTIVE, isInactive);

    }, Config.setInactiveAfter || 0);
  }

  if (isInactive && isTabVisible) {
    if (timeOut) {
      clearTimeout(timeOut);
      timeOut = null;
    }

    isInactive = false;
    VisibilityUtil.emit(UI_INACTIVE, isInactive);
  }
}

// Listen for visibility change events
visibility.addEventListener(function () {
  // We need setTimeout because browser hasn't yet given us the execution
  // context.
  setTimeout(function () {
    updateActiveState();
  }, 0);
});

const VisibilityUtil = _.extend({}, Events.EventEmitter.prototype, {
  addInactiveListener(callback) {
    return this.on(UI_INACTIVE, callback);
  },

  removeInactiveListener(callback) {
    return this.removeListener(UI_INACTIVE, callback);
  },

  isTabVisible() {
    return isTabVisible;
  },

  isInactive() {
    return isInactive;
  }
});

module.exports = VisibilityUtil;
