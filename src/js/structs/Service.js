import Item from './Item';

const RID_PREFIX = 'service.';

export default class Service extends Item {
  constructor() {
    super(...arguments);
    this.setResourceID();
  }

  setResourceID() {
    // strip non-alphanumeric chars from name for safety
    let rid = RID_PREFIX + this.get('name').replace(/\W+/g, '');
    this._itemData.rid = rid;
  }

  getNodeIDs() {
    return this.get('slave_ids');
  }

  getUsageStats(resource) {
    let value = this.get('used_resources')[resource];

    return {value};
  }
}
