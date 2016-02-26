import ClientList from './ClientList';
import Item from '../../../src/js/structs/Item';

module.exports = class BackendConnection extends Item {
  getClients() {
    return new ClientList({items: this.get('clients')});
  }
};
