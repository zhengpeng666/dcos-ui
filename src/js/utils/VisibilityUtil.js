let isTabVisible = true;

const VisibilityUtil = {
  isTabVisible() {
    return isTabVisible;
  }
};

// Use visibility API to check if current tab is active or not
let vis = (function () {
  let stateKey;
  let eventKey;
  let keys = {
    hidden: 'visibilitychange',
    webkitHidden: 'webkitvisibilitychange',
    mozHidden: 'mozvisibilitychange',
    msHidden: 'msvisibilitychange'
  };

  for (stateKey in keys) {
    if (stateKey in document) {
        eventKey = keys[stateKey];
        break;
    }
  }
  return function(callback) {
    if (callback) {
      document.addEventListener(eventKey, callback);
    }
    return !document[stateKey];
  }
})();

// Listen for visibility change events
vis(function () {
  setTimeout(function () {
    isTabVisible = vis();
  }, 0);
});

module.exports = VisibilityUtil;
