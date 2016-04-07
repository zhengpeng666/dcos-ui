// Configuration overrides
var ConfigDev = {
  analyticsKey: '39uhSEOoRHMw6cMR6st9tYXDbAL3JSaP',
  rootUrl: 'http://dcos.local',
  historyServer: 'http://dcos.local',
  uiConfigurationFixture: {
    uiConfiguration: {
      plugins: {
        authentication: {
          enabled: false
        },
        // Enable oauth OR authentication
        oauth: {
          enabled: false,
          clientID: 'IBcqrIBD0yMz0xjZCSvZz2BKc3zr43Dw',
          authLocation: 'https://opendcos.auth0.com/login',
          authHost: 'https://opendcos.auth0.com'
        },
        banner: {
          enabled: false
        },
        'external-links': {
          enabled: false
        },
        networking: {
          enabled: true
        },
        organization: {
          enabled: true
        },
        'overview-detail': {
          enabled: true
        },
        tracking: {
          enabled: true
        }
      }
    },
    clusterConfiguration: {
      firstUser: true,
      id: 'ui-fixture-cluster-id'
    }
  },
  useFixtures: false,
  useUIConfigFixtures: false
};

module.exports = ConfigDev;
