import ClientList from './ClientList';

let SDK = require('../SDK').getSDK();
let Item = SDK.get('Item');

module.exports = class BackendConnection extends Item {
  getClients() {
    return new ClientList({items: this.get('clients')});
  }
};
