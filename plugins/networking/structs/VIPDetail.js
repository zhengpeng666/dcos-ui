import _ from 'underscore';

import BackendList from './BackendList';
let SDK = require('../SDK').getSDK();

let Item = SDK.get('Item');

module.exports = class VIPDetail extends Item {
  getBackends() {
    return new BackendList({items: this.get('backends')});
  }

  getRequestSuccesses() {
    return _.values(this.get('request_success'));
  }

  getRequestFailures() {
    return _.values(this.get('request_fail'));
  }
};
