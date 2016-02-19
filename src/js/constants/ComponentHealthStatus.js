const ComponentHealthStatus = {
  NA: {
    title: 'N/A',
    value: 0,
    classNames: 'text-mute'
  },
  HEALTHY: {
    title: 'Healthy',
    value: 1,
    classNames: 'text-success'
  },
  WARN: {
    title: 'Warning',
    value: 2,
    classNames: 'text-warning'
  },
  UNHEALTHY: {
    title: 'Unhealthy',
    value: 3,
    classNames: 'text-danger'
  }
};

module.exports = ComponentHealthStatus;
