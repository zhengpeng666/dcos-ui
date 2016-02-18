// This will change but allows us to provide a simple example.
module.exports = {
  examplePluginName: {
    plugin: require('./example/example'),
    configOptions: {
      multiplier: 2,
      enabled: true
    }
  }
};
