import Item from './Item';

module.exports = class VIPDetail extends Item {
  getBackends() {
    return this.get('backends');
  }
};
