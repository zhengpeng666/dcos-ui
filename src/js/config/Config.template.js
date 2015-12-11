// Configuration overrides
var ConfigDev = {
  analyticsKey: "39uhSEOoRHMw6cMR6st9tYXDbAL3JSaP",
  rootUrl: "http://dcos.local",
  historyServer: "http://dcos.local",
  uiConfigurationFixture: {
    uiConfiguration: {
      plugins: {
        authentication: {
          enabled: false
        },
        banner: {},
        settings: {
          enabled: true
        },
        tracking: {
          enabled: true
        }
      }
    }
  },
  useFixtures: false,
  useUIConfigFixtures: false
};

module.exports = ConfigDev;
