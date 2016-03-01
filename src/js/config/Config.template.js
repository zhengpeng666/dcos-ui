// Configuration overrides
var ConfigDev = {
  analyticsKey: '39uhSEOoRHMw6cMR6st9tYXDbAL3JSaP',
  rootUrl: 'http://dcos.local',
  historyServer: 'http://dcos.local',
  uiConfigurationFixture: {
    uiConfiguration: {
      plugins: {
        Auth: {
          enabled: true
        },
        Banner: {
          enabled: false
        },
        Organization: {
          enabled: true
        },
        Overview: {
          enabled: true
        },
        Tracking: {
          enabled: true
        }
      }
    }
  },
  useFixtures: false,
  useUIConfigFixtures: false
};

module.exports = ConfigDev;
