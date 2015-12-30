var Config = {
  analyticsKey: "@@ANALYTICS_KEY",
  acsAPIPrefix: "/acs/api/v1",
  delayAfterErrorCount: 5,
  environment: "@@ENV",
  historyLength: 31,
  historyServer: "",
  rootUrl: "",
  stateLoadDelay: 3000,
  stateRefresh: 2000,
  tailRefresh: 2000,
  version: "@@VERSION"
};

Config.getRefreshRate = function () {
  return this.stateRefresh;
};

// @@ENV gets replaced by Broccoli
if (Config.environment === "development") {
  var _ = require("underscore");
  var ConfigDev = require("./Config.dev.js");

  Config.analyticsKey = ""; // Safeguard from developers logging to prod
  Config = _.extend(Config, ConfigDev);
} else if (Config.environment === "testing") {
  var _ = require("underscore");
  var ConfigDev = require("./Config.test.js");

  Config.analyticsKey = ""; // Safeguard from developers logging to prod
  Config = _.extend(Config, ConfigDev);
} else if (Config.environment === "production") {
  Config.useFixtures = false;
}

Config.setOverrides = function (overrides) {
  this.rootUrl = overrides.rootUrl || this.rootUrl;
  this.historyServer = overrides.historyServer || this.historyServer;
};

module.exports = Config;
