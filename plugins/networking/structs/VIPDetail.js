import BackendList from './BackendList';
import Item from '../../../src/js/structs/Item';

module.exports = class VIPDetail extends Item {
  getBackends() {
    return new BackendList({items: this.get('backends')});
  }
};
