var HealthTypes = require("./HealthTypes");

var HealthStatus = {
  "na": {key: "NA", value: HealthTypes.NA},
  "healthy": {key: "HEALTHY", value: HealthTypes.HEALTHY},
  "unhealthy": {key: "UNHEALTHY", value: HealthTypes.UNHEALTHY},
  "idle": {key: "IDLE", value: HealthTypes.IDLE}
};

module.exports = HealthStatus;
