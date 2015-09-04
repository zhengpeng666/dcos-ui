import HealthTypes from "./HealthTypes";

const HealthStatus = {
  NA: {
    key: "NA",
    value: HealthTypes.NA,
    classes: "text-mute"
  },
  HEALTHY: {
    key: "HEALTHY",
    value: HealthTypes.HEALTHY,
    classes: "text-success"
  },
  UNHEALTHY: {
    key: "UNHEALTHY",
    value: HealthTypes.UNHEALTHY,
    classes: "text-danger"
  },
  IDLE: {
    key: "IDLE",
    value: HealthTypes.IDLE,
    classes: "text-warning"
  }
};

module.exports = HealthStatus;
