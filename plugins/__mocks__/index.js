let pluginList = {};

module.exports = {
  __setMockPlugins: function (plugins) {
    pluginList = plugins;
  },
  getAvailablePlugins: function () {
    return pluginList;
  }
};
