
let _pluginList = {};

// Get the automatic mock for `index`
var pluginsMock = jest.genMockFromModule('../index');

pluginsMock.__setMockPlugins = function (plugins) {
  _pluginList = plugins;
};

function getAvailablePlugins() {
  return _pluginList;
}

pluginsMock.getAvailablePlugins.mockImplementation(getAvailablePlugins);

module.exports = pluginsMock;
