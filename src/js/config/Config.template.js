// Configuration overrides

var ee = true;

var ConfigDev = {
  analyticsKey: '39uhSEOoRHMw6cMR6st9tYXDbAL3JSaP',
  rootUrl: 'http://dcos.local',
  historyServer: 'http://dcos.local',
  uiConfigurationFixture: {
    uiConfiguration: {
      plugins: {
        authentication: {
          enabled: ee
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
          enabled: ee
        },
        networking: {
          enabled: ee
        },
        organization: {
          enabled: ee
        },
        'overview-detail': {
          enabled: true
        },
        tracking: {
          enabled: ee
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
