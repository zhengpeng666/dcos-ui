import ExamplePlugin from './example/example';

const pluginList = {
  'example': ExamplePlugin
};

module.exports = {
  getAvailablePlugins: function () {
    return pluginList;
  }
};
