import PluginTestUtils from 'PluginTestUtils';

let SDK = PluginTestUtils.getSDK('organization', {enabled: true});
require('../../SDK').setSDK(SDK);

var Client = require('../Client');
var ClientList = require('../ClientList');

describe('ClientList', function () {

  describe('#constructor', function () {

    it('creates instances of Client', function () {
      var items = [{foo: 'bar'}];
      var list = new ClientList({items});
      items = list.getItems();
      expect(items[0] instanceof Client).toBeTruthy();
    });

  });

});
