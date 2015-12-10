// Configuration overrides
var ConfigDev = {
  analyticsKey: "39uhSEOoRHMw6cMR6st9tYXDbAL3JSaP",
  rootUrl: "http://dcos.local",
  historyServer: "http://dcos.local",
  uiConfigurationFixture: {
    uiConfiguration: {
      plugins: {
        banner: {},
        tracking: {
          enabled: true
        },
        authentication: {
          enabled: false
        }
      }
    }
  },
  useFixtures: false
};

module.exports = ConfigDev;
