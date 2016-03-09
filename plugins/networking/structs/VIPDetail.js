import BackendList from './BackendList';
let SDK = require('../SDK').getSDK();

let Item = SDK.get('Item');

module.exports = class VIPDetail extends Item {
  getBackends() {
    return new BackendList({items: this.get('backends')});
  }
};
