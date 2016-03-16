/* eslint no-redeclare: 0 */
var _ = require('underscore');
var ConfigDev = require('./Config.dev.js');
var ConfigTest = require('./Config.test.js');

var Config = {
  analyticsKey: '@@ANALYTICS_KEY',
  acsAPIPrefix: '/acs/api/v1',
  networkingAPIPrefix: '/networking/api/v1',
  cosmosAPIPrefix: '/package',
  delayAfterErrorCount: 5,
  environment: '@@ENV',
  externalPluginsDirectory: '../dcos-ui-plugins-private',
  historyLength: 31,
  historyServer: '',
  rootUrl: '',
  stateLoadDelay: 3000,
  stateRefresh: 2000,
  tailRefresh: 10000,
  unitHealthAPIPrefix: '/system/health/v1',
  version: '@@VERSION'
};

Config.getRefreshRate = function () {
  return this.stateRefresh;
};

// @@ENV gets replaced by Broccoli
if (Config.environment === 'development') {
  Config.analyticsKey = ''; // Safeguard from developers logging to prod
  Config = _.extend(Config, ConfigDev);
} else if (Config.environment === 'testing') {
  Config.analyticsKey = ''; // Safeguard from developers logging to prod
  Config = _.extend(Config, ConfigTest);
} else if (Config.environment === 'production') {
  Config.useFixtures = false;
}

Config.setOverrides = function (overrides) {
  this.rootUrl = overrides.rootUrl || this.rootUrl;
  this.historyServer = overrides.historyServer || this.historyServer;
};

module.exports = Config;
