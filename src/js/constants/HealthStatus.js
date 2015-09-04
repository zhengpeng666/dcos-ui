import HealthTypes from "./HealthTypes";

const HealthStatus = {
  NA: {
    key: "NA",
    value: HealthTypes.NA,
    classes: {"text-mute": true}
  },
  HEALTHY: {
    key: "HEALTHY",
    value: HealthTypes.HEALTHY,
    classes: {"text-success": true}
  },
  UNHEALTHY: {
    key: "UNHEALTHY",
    value: HealthTypes.UNHEALTHY,
    classes: {"text-danger": true}
  },
  IDLE: {
    key: "IDLE",
    value: HealthTypes.IDLE,
    classes: {"text-warning": true}
  }
};

module.exports = HealthStatus;
