import Item from './Item';
import UnitHealthStatus from '../constants/UnitHealthStatus';

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
    let health = this.get('node_health');

    return Object.keys(UnitHealthStatus).reduce(function (prev, healthObj) {
      if (UnitHealthStatus[healthObj].value === health) {
        return UnitHealthStatus[healthObj];
      }
      return prev;
    }, null) || UnitHealthStatus.NA;
  }

};
