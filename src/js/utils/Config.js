var Config = {
  rootUrl: "http://localhost:5050",
  stateRefresh: 2000,
  historyLength: 31,
  analyticsKey: "51ybGTeFEFU1xo6u10XMDrr6kATFyRyh",
  environment: "@@ENV",
  stateLoadDelay: 1500,
  version: "@@VERSION"
};

// @@ENV gets replaced by Broccoli
if (Config.environment === "development") {
  var _ = require("underscore");
  var ConfigDev = require("./Config.dev.js");
  Config = _.extend(Config, ConfigDev);
}

module.exports = Config;
