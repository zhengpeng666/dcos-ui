
var fakePluginNoReducer = jest.genMockFunction().mockImplementation(
  function () {
    // Don't return anything
  }
);

var fakePluginWithReducer = jest.genMockFunction().mockImplementation(
  function () {
    // Return reducer
    return function () {
      // Return an initial state
      return {foo: 'bar'};
    };
  }
);

const pluginList = {
  fakePluginNoReducer: fakePluginNoReducer,
  fakePluginWithReducer: fakePluginWithReducer
};

// Simple helper to aid in test mocking
const getAvailablePlugins = function () {
  return pluginList;
};

module.exports = {
  getAvailablePlugins: getAvailablePlugins,
  mocks: {
    fakePluginNoReducer: fakePluginNoReducer,
    fakePluginWithReducer: fakePluginWithReducer
  }
};
