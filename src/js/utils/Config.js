var Config = {
  isDevelopment: true,
  // rootUrl: "http://10.141.141.10:5050",
  rootUrl: "http://master0.test-suite.msphere.co:5050",
  // rootUrl: "http://srv5.hw.ca1.mesosphere.com:5050",
  stateRefresh: 2000,
  historyLength: 30
};

// @@ENV gets replaced by Broccoli
if ("@@ENV" === "production") {
  Config.isDevelopment = false;
  Config.rootUrl = "http://localhost:5050";
} else {
  if ("@@USER" === "felix") {
    Config.rootUrl = "http://srv5.hw.ca1.mesosphere.com:5050";
  }
}

module.exports = Config;
