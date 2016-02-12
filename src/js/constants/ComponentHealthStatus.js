import ComponentHealthTypes from './ComponentHealthTypes';

const ComponentHealthStatus = {
  NA: {
    key: 'NA',
    value: ComponentHealthTypes.NA,
    classNames: 'text-mute',
    title: 'NA'
  },
  HEALTHY: {
    key: 'HEALTHY',
    value: ComponentHealthTypes.HEALTHY,
    classNames: 'text-success',
    title: 'Healthy'
  },
  UNHEALTHY: {
    key: 'UNHEALTHY',
    value: ComponentHealthTypes.UNHEALTHY,
    classNames: 'text-danger',
    title: 'Unhealthy'
  },
  WARN: {
    key: 'WARN',
    value: ComponentHealthTypes.WARN,
    classNames: 'text-warning',
    title: 'Warning'
  }
};

module.exports = ComponentHealthStatus;
