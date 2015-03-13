var HealthTypes = {
  SICK: 2, // if tasksUnhealthy > 0
  HEALTHY: 1, // if tasksUnhealthy === 0 && tasksHealthy > 0
  IDLE: 0 // else tasksRunning === 0
};

module.exports = HealthTypes;
