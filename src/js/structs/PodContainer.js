import Item from './Item';
import PodVisualState from '../constants/PodVisualState';
import PodContainerState from '../constants/PodContainerState';

module.exports = class PodContainer extends Item {
  getContainerStatus() {
    switch (this.get('status')) {
      case PodContainerState.DROPPED:
        return PodVisualState.DROPPED;
      case PodContainerState.ERROR:
        return PodVisualState.ERROR;
      case PodContainerState.FAILED:
        return PodVisualState.FAILED;
      case PodContainerState.FINISHED:
        return PodVisualState.FINISHED;
      case PodContainerState.GONE:
      case PodContainerState.GONE_BY_OPERATOR:
        return PodVisualState.GONE;
      case PodContainerState.KILLED:
        return PodVisualState.KILLED;
      case PodContainerState.KILLING:
        return PodVisualState.KILLING;
      case PodContainerState.LOST:
        return PodVisualState.LOST;

      case PodContainerState.RUNNING:
        if (this.hasHealthChecks()) {
          if (this.isHealthy()) {
            return PodVisualState.HEALTHY;
          } else {
            return PodVisualState.UNHEALTHY;
          }
        } else {
          return PodVisualState.RUNNING;
        }

      case PodContainerState.STAGING:
        return PodVisualState.STAGING;
      case PodContainerState.STARTING:
        return PodVisualState.STARTING;
      case PodContainerState.UNREACHABLE:
        return PodVisualState.UNREACHABLE;

      case PodContainerState.UNKNOWN:
      default:
        return PodVisualState.NA;
    }
  }

  getEndpoints() {
    return this.get('endpoints') || [];
  }

  getId() {
    return this.get('containerId') || '';
  }

  getLastChanged() {
    return new Date(this.get('lastChanged') || '');
  }

  getLastUpdated() {
    return new Date(this.get('lastUpdated') || '');
  }

  getName() {
    return this.get('name') || '';
  }

  getResources() {
    return Object.assign({
      cpus: 0,
      mem: 0,
      gpus: 0,
      disk: 0
    }, this.get('resources'));
  }

  hasHealthChecks() {
    // According to RAML specs:
    //
    // https://github.com/mesosphere/marathon/blob/feature/pods/docs/docs/rest-api/public/api/v2/types/container-status.raml#L49
    // 'healthy: should only be present if a health check is defined for this endpoint'
    //
    let endpoints = this.getEndpoints();
    let allHaveChecks = (endpoints.length > 0);
    let hasFailure = false;

    this.getEndpoints().forEach(function (ep) {
      if (ep.healthy === undefined) {
        allHaveChecks = false;
      }
      if (ep.healthy === false) {
        hasFailure = true;
      }
    });

    return allHaveChecks || hasFailure;
  }

  isHealthy() {
    // If we have at least 1 health check and it has failed, we are assumed to
    // be unhealthy.
    return !this.getEndpoints().some(function (ep) {
      return ep.healthy !== undefined && !ep.healthy;
    });
  }
};
