let SDK = {
  get() {
    console.log('not loaded yet');
  }
};

module.exports = {
  getSDK: function () {
    return SDK;
  },
  setSDK: function (pluginSDK) {
    SDK = pluginSDK;
  }
};
