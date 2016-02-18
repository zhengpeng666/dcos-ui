import Item from './Item';
import ComponentHealthStatus from '../constants/ComponentHealthStatus';

module.exports = class Node extends Item {
  getServiceIDs() {
    return this.get('framework_ids');
  }

  isActive() {
    return this.get('active');
  }

  getUsageStats(resource) {
    let total = this.get('resources')[resource];
    let value = this.get('used_resources')[resource];
    let percentage = Math.round(100 * value / Math.max(1, total));

    return {percentage, total, value};
  }

  // Below is Component Health specific API
  // http://schema.dcos/system/health/node

  getHealth() {
    let health = this.get('health');

    return Object.keys(ComponentHealthStatus).reduce(function (prev, healthObj) {
      if (ComponentHealthStatus[healthObj].value === health) {
        return ComponentHealthStatus[healthObj];
      }
      return prev;
    }, null) || ComponentHealthStatus.NA;
  }

};
