var Config = {
  analyticsKey: "51ybGTeFEFU1xo6u10XMDrr6kATFyRyh",
  environment: "@@ENV",
  historyLength: 31,
  rootUrl: "http://localhost:5050",
  stateLoadDelay: 1500,
  stateRefresh: 2000,
  version: "@@VERSION"
};

// @@ENV gets replaced by Broccoli
if (Config.environment === "development") {
  var _ = require("underscore");
  var ConfigDev = require("./Config.dev.js");

  Config.analyticsKey = ""; // Safeguard from developers logging to prod
  Config = _.extend(Config, ConfigDev);
}

module.exports = Config;
