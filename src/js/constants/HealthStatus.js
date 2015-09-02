import HealthTypes from "./HealthTypes";

const HealthStatus = {
  NA: {key: "NA", value: HealthTypes.NA},
  HEALTHY: {key: "HEALTHY", value: HealthTypes.HEALTHY},
  UNHEALTHY: {key: "UNHEALTHY", value: HealthTypes.UNHEALTHY},
  IDLE: {key: "IDLE", value: HealthTypes.IDLE}
};

module.exports = HealthStatus;
