let isTabVisible = true;

const VisibilityUtil = {
  isTabVisible() {
    return isTabVisible;
  }
};

// Use visibility API to check if current tab is active or not
let visibility = (function () {
  let stateKey;
  let eventKey;
  let keys = {
    hidden: 'visibilitychange',
    webkitHidden: 'webkitvisibilitychange',
    mozHidden: 'mozvisibilitychange',
    msHidden: 'msvisibilitychange'
  };

  // Find first stateKey available on document
  Object.keys().some(function (stateKey) {
    if (stateKey in global.document) {
      eventKey = keys[stateKey];
      return true;
    }
    return false;
  });

  return {
    addEventListener(callback) {
      global.document.addEventListener(eventKey, callback);
    },

    getVisibility() {
      return !global.document[stateKey];
    }
  }
})();

// Listen for visibility change events
visibility.addEventListener(function () {
  // We need setTimeout because browser hasn't yet given us the execution
  // context.
  setTimeout(function () {
    isTabVisible = visibility.getVisibility();
  }, 0);
});

module.exports = VisibilityUtil;
