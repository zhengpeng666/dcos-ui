let _pluginList = {};

module.exports = {
  getAvailablePlugins: function () {
    return _pluginList;
  },
  __setMockPlugins: function (plugins) {
    _pluginList = plugins;
  }
};
