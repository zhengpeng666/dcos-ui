import HealthStatus from '../constants/HealthStatus';
import Item from './Item';

const RID_PREFIX = 'dcos:adminrouter:service:';

module.exports = class Service extends Item {
  getHealth() {
    let meta = this.get('_meta');
    if (!meta || !meta.marathon) {
      return HealthStatus.NA;
    }
    return meta.marathon.health;
  }

  getResourceID() {
    // strip non-alphanumeric chars from name for safety
    return RID_PREFIX + (this.get('name') || '').replace(/[^a-zA-Z0-9-]/g, '');
  }

  getNodeIDs() {
    return this.get('slave_ids');
  }

  getUsageStats(resource) {
    let value = this.get('used_resources')[resource];

    return {value};
  }
};
