// put in your config overrides here
var ConfigDev = {
  analyticsKey: "39uhSEOoRHMw6cMR6st9tYXDbAL3JSaP",
  disableLoginModal: false,
  rootUrl: "http://dcos.local",
  historyServer: "http://dcos.local",
  uiConfigurationFixture: {
    uiConfiguration: {
      plugins: {
        banner: {},
        tracking: {
          enabled: true
        }
      }
    }
  }
};

module.exports = ConfigDev;
