import Item from './Item';

const RID_PREFIX = 'service.';

export default class Service extends Item {
  constructor() {
    super(...arguments);
  }

  getResourceID() {
    // strip non-alphanumeric chars from name for safety
    return RID_PREFIX + (this.get('name') || '').replace(/\W+/g, '');
  }

  getNodeIDs() {
    return this.get('slave_ids');
  }

  getUsageStats(resource) {
    let value = this.get('used_resources')[resource];

    return {value};
  }
}
