var Config = {
  isDevelopment: false,
  rootUrl: "http://localhost:5050",
  stateRefresh: 2000,
  historyLength: 31,
  environment: "@@ENV",
  version: "@@VERSION"
};

// @@ENV gets replaced by Broccoli
if (Config.version === "development") {
  var _ = require("underscore");
  var ConfigDev = require("./Config.dev.js");
  Config = _.extend(Config, ConfigDev);
}

module.exports = Config;
