import Item from './Item';
import PodContainer from './PodContainer';
import PodContainerState from '../constants/PodContainerState';
import PodInstanceStatus from '../constants/PodInstanceStatus';
import PodInstanceState from '../constants/PodInstanceState';
import PodVisualState from '../constants/PodVisualState';
import StringUtil from '../utils/StringUtil';

module.exports = class PodInstance extends Item {
  getAgentAddress() {
    return this.get('agentHostname') || '';
  }

  getContainers() {
    let containers = this.get('containers') || [];
    return containers.map((container) => {
      return new PodContainer(container);
    });
  }

  getId() {
    return this.get('id') || '';
  }

  getName() {
    return this.getId();
  }

  getInstanceStatus() {
    switch (this.get('status')) {
      case PodInstanceState.PENDING:
        return PodVisualState.STAGED;

      case PodInstanceState.STAGING:
        return PodVisualState.STAGED;

      case PodInstanceState.STABLE:
        if (this.hasHealthChecks()) {
          if (this.isHealthy()) {
            return PodVisualState.HEALTHY;
          } else {
            return PodVisualState.UNHEALTHY;
          }
        } else {
          return PodVisualState.RUNNING;
        }

      case PodInstanceState.DEGRADED:
        if (this.hasContainerInStatus(PodContainerState.ERROR)) {

        }
        return PodVisualState.UNHEALTHY;

      case PodInstanceState.TERMINAL:
        return PodVisualState.KILLED;

      default:
        return Object.assign(Object.create(PodVisualState.NA), {
          displayName: StringUtil.capitalize(this.get('status').toLowerCase())
        });
    }
  }

  getLastChanged() {
    return new Date(this.get('lastChanged'));
  }

  getLastUpdated() {
    return new Date(this.get('lastUpdated'));
  }

  getResources() {
    let resources = this.get('resources') || {};

    return Object.assign({
      cpus: 0,
      mem: 0,
      gpus: 0,
      disk: 0
    }, resources);
  }

  hasContainerInStatus(status) {
    return this.getContainers().some(function (container) {
      return container.get('status') === status;
    });
  }

  hasAllContainersInStatus(status) {
    return this.getContainers().every(function (container) {
      return container.get('status') === status;
    });
  }

  hasHealthChecks() {
    // If for any reason any of the containers has at least 1 health
    // check that is failing, assume that we have leath checks
    if (!this.isHealthy()) {
      return true;
    }

    // If we have no containers, return false
    let containers = this.getContainers();
    if (!containers.length) {
      return false;
    }

    // Otherwise ALL container must have health checks in order to be
    // considered healthy.
    return containers.every(function (container) {
      return container.hasHealthChecks();
    });
  }

  isHealthy() {
    if (this.get('status') !== PodInstanceState.STABLE) {
      return false;
    }
    return this.getContainers().every(function (container) {
      return container.isHealthy();
    });
  }

  isRunning() {
    let status = this.get('status');
    return (status === PodInstanceState.STABLE) ||
           (status === PodInstanceState.DEGRADED);
  }

  isStaging() {
    let status = this.get('status');
    return (status === PodInstanceState.PENDING) ||
           (status === PodInstanceState.STAGING);
  }

  isTerminating() {
    return this.get('status') === PodInstanceState.TERMINAL;
  }
};
